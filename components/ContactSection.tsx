
import React, { useState, FormEvent } from 'react';

type FormDataType = {
  project_type: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  org: string;
  phone: string;
  needs: string;
};

// --- Form Stepper Component ---
interface StepperProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  onFinish: () => void;
}

const Stepper: React.FC<StepperProps> = ({ formData, setFormData, onFinish }) => {
  const [step, setStep] = useState(1);
  
  const handleChipClick = (field: keyof FormDataType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = (next: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(next);
  };
  
  const finish = (e: React.MouseEvent) => {
    e.preventDefault();
    onFinish();
  }

  const stepIndicators = [1, 2, 3].map(i => (
    <span key={i} className={`rounded-full px-2 py-0.5 ${step >= i ? 'bg-white/10' : 'bg-white/5'}`}>{i}</span>
  ));

  return (
    <div id="stepper" className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs text-slate-300">{stepIndicators}</div>
      
      {step === 1 && (
        <div className="mt-3">
          <p className="text-sm">What are you looking for?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Website', 'Ecommerce', 'Security', 'Marketing', 'Video', 'Apps/Automation'].map(val => (
              <button type="button" key={val} className={`chip ${formData.project_type === val ? 'active' : ''}`} onClick={() => handleChipClick('project_type', val)}>{val}</button>
            ))}
          </div>
          <div className="mt-3 flex justify-end"><button type="button" onClick={nextStep(2)} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600">Next</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-3">
          <p className="text-sm">Rough budget?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['< $2k', '$2k–$5k', '$5k–$10k', '$10k+'].map(val => (
              <button type="button" key={val} className={`chip ${formData.budget === val ? 'active' : ''}`} onClick={() => handleChipClick('budget', val)}>{val}</button>
            ))}
          </div>
          <div className="mt-3 flex justify-between"><button type="button" onClick={nextStep(1)} className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">Back</button><button type="button" onClick={nextStep(3)} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600">Next</button></div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-3">
          <p className="text-sm">Timeline?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['ASAP', '2–4 weeks', '1–3 months'].map(val => (
              <button type="button" key={val} className={`chip ${formData.timeline === val ? 'active' : ''}`} onClick={() => handleChipClick('timeline', val)}>{val}</button>
            ))}
          </div>
          <div className="mt-3 flex justify-between"><button type="button" onClick={nextStep(2)} className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">Back</button><button type="button" onClick={finish} className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600">Continue</button></div>
        </div>
      )}
    </div>
  );
};

// --- Main Contact Section ---
const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>({
        project_type: '', budget: '', timeline: '',
        name: '', email: '', org: '', phone: '', needs: ''
    });
    const [isStepperVisible, setStepperVisible] = useState(true);
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        setStatus('Submitting…');
        
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value as string);
        });
        data.append('form-name', 'unitytech-intake');
      
        try {
          const endpoint = process.env.FORMSPREE_ENDPOINT;
          if (!endpoint) throw new Error('No endpoint configured');
          
          const res = await fetch(endpoint, { method:'POST', body: data, headers: { 'Accept': 'application/json' }});
          
          if(res.ok){
            form.reset();
            setFormData({ project_type: '', budget: '', timeline: '', name: '', email: '', org: '', phone: '', needs: '' });
            setStepperVisible(true);
            setStatus('Thanks! We\'ll reach out shortly.');
            (window as any).showSuccessModal?.();
          } else {
            const body = await res.json().catch(()=>({errors:[]}));
            throw new Error(body.errors?.map((e: any) => e.message).join(', ') || 'Submit failed');
          }
        } catch(err){
            setStatus('Direct submit unavailable — opening your email client…');
            const subject = encodeURIComponent('New UnityTech inquiry');
            const body = encodeURIComponent(
                Object.entries(formData).map(([k,v]) => `${k.replace('_', ' ')}: ${v}`).join('\n')
            );
            window.location.href = `mailto:admin@unitytech.solutions?subject=${subject}&body=${body}`;
        }
    };

    return (
        <section id="contact" className="mx-auto max-w-7xl px-6 pb-24">
            <div className="grid lg:grid-cols-5 gap-8">
                <div data-reveal="card" className="lg:col-span-3 glass rounded-2xl p-6 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-bold font-ox">Start a conversation</h2>
                    <p className="mt-2 text-slate-300">Tell us about your goals. We’ll review and book a discovery call.</p>
                    
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <input type="hidden" name="form-name" value="unitytech-intake" />
                        {isStepperVisible && <Stepper formData={formData} setFormData={setFormData} onFinish={() => setStepperVisible(false)} />}
                        
                        <div className={`grid sm:grid-cols-2 gap-4 ${isStepperVisible ? 'hidden' : ''}`}>
                            <div>
                                <label className="text-sm text-slate-300">Name</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400" placeholder="Your full name" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-300">Email</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400" placeholder="you@company.com" />
                            </div>
                        </div>
                        <div className={`grid sm:grid-cols-2 gap-4 ${isStepperVisible ? 'hidden' : ''}`}>
                            <div>
                                <label className="text-sm text-slate-300">Company</label>
                                <input name="org" value={formData.org} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400" placeholder="Business or project" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-300">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400" placeholder="Optional" />
                            </div>
                        </div>
                        <div className={isStepperVisible ? 'hidden' : ''}>
                            <label className="text-sm text-slate-300">What do you need help with?</label>
                            <textarea required name="needs" rows={4} value={formData.needs} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400" placeholder="Briefly describe your goals, challenges, and timeline"></textarea>
                        </div>
                        <div className={`flex items-center gap-3 ${isStepperVisible ? 'hidden' : ''}`}>
                            <button type="submit" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-brand-500 hover:bg-brand-600 transition shadow-glow">
                                Submit Request
                            </button>
                            <p className="text-xs text-slate-400">By submitting, you agree to be contacted about your request.</p>
                        </div>
                        <p className="text-sm mt-2 text-slate-300" role="status">{status}</p>
                    </form>
                </div>

                <aside data-reveal="card" className="lg:col-span-2 glass rounded-2xl p-6 md:p-10">
                    <h3 className="text-xl font-semibold font-ox">Contact</h3>
                    <ul className="mt-3 space-y-2 text-slate-300">
                        <li>Email: <a className="underline decoration-brand-400/60 hover:decoration-brand-400" href="mailto:admin@unitytech.solutions">admin@unitytech.solutions</a></li>
                        <li>Email: <a className="underline decoration-brand-400/60 hover:decoration-brand-400" href="mailto:emir@unitytech.solutions">emir@unitytech.solutions</a></li>
                    </ul>
                    <div className="mt-6 text-sm text-slate-400">
                        <p>We respect your privacy. Data from this form is used only to respond to your inquiry.</p>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default ContactSection;