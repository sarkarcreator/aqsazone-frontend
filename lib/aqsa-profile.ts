export interface ProfileEntry { id: string; published: boolean; [key: string]: string | boolean; }
export interface AqsaSkill { id: string; name: string; published: boolean; }
export interface AqsaJuttProfile {
  name: string; title: string; intro: string; location: string; published: boolean;
  skills: AqsaSkill[];
  languages: Array<{id:string; name:string; level:string; published:boolean}>;
  experience: Array<{id:string; company:string; role:string; duration:string; description:string; period:string; published:boolean}>;
  education: Array<{id:string; degree:string; institution:string; year:string; published:boolean}>;
}
export const defaultAqsaJuttProfile: AqsaJuttProfile = {
 name: "Aqsa Jutt", title: "Content Writer",
 intro: "I am a creative Content Writer, Script Writer, and Video Editor, skilled at turning ideas into engaging words and compelling visuals. I write clear, impactful content and scripts that grab attention, educate viewers, and boost engagement. With strong storytelling and editing skills, I create content that is simple, powerful, and result-focused.",
 location: "Jaranwala Road, Faisalabad", published: true,
 skills: [
  {id:"skill-communication",name:"Communication",published:true},
  {id:"skill-time-management",name:"Time management",published:true},
  {id:"skill-organization",name:"Organization",published:true},
  {id:"skill-technical",name:"Technical skills",published:true},
  {id:"skill-research",name:"Research",published:true},
  {id:"skill-content-writing",name:"Content writing",published:true},
  {id:"skill-video-editing",name:"Video editing",published:true},
  {id:"skill-script-writing",name:"Script writing",published:true},
  {id:"skill-teamwork",name:"Team Work",published:true},
  {id:"skill-copywriting",name:"Copywriting",published:true}
 ],
 languages: [
  {id:"lang-english",name:"English",level:"Good",published:true},
  {id:"lang-urdu",name:"Urdu",level:"Good",published:true},
  {id:"lang-punjabi",name:"Punjabi",level:"Excellent",published:true}
 ],
 experience: [
  {id:"exp-bixosoft",company:"Bixosoft",role:"Content Writing",duration:"1 year",period:"",description:"Gained hands-on experience in writing clear, engaging and audience-focused content for digital platforms. Skilled in creating blogs, scripts and marketing content that educates, engages, and delivers results.",published:true},
  {id:"exp-technolangs",company:"Technolangs",role:"Content Writing",duration:"1.5 year",period:"",description:"Wrote engaging short-form scripts on celebrities, viral trends, lifestyle updates, and social media news tailored for TikTok audiences.",published:true},
  {id:"exp-vision-pro",company:"Vision Pro",role:"Client Hunter, Script Writer & Video Editor",duration:"3 years",period:"",description:"Handled client hunting through professional emails and outreach, persuasive video scripts for digital services, and edited engaging videos to attract and convert potential clients.",published:true},
  {id:"exp-webtech",company:"WebTech",role:"SEO Tech Article Writer",duration:"Present",period:"Present",description:"Write research-based, SEO-optimized tech articles for Techuy.com.",published:true}
 ],
 education: [
  {id:"edu-bsc",degree:"BSc",institution:"Government College University Faisalabad",year:"2022",published:true},
  {id:"edu-ics",degree:"ICS",institution:"Tips College",year:"2018",published:true},
  {id:"edu-matric",degree:"Matric",institution:"Govt. Public Girls High School",year:"2016",published:true}
 ]
};
export function parseAqsaJuttProfile(raw?: string | null): AqsaJuttProfile {
 try {
  if (!raw) return defaultAqsaJuttProfile;
  const parsed = JSON.parse(raw) as {
   name?: string; title?: string; intro?: string; location?: string; published?: boolean;
   skills?: unknown[];
   languages?: AqsaJuttProfile["languages"];
   experience?: AqsaJuttProfile["experience"];
   education?: AqsaJuttProfile["education"];
  };
  const incomingSkills: unknown[] = Array.isArray(parsed.skills) ? parsed.skills : defaultAqsaJuttProfile.skills;
  const skills: AqsaSkill[] = incomingSkills.flatMap((skill, index): AqsaSkill[] => {
    if (typeof skill === "string") return [{ id: `skill-legacy-${index}-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: skill, published: true }];
    if (!skill || typeof skill !== "object") return [];
    const item = skill as Partial<AqsaSkill>;
    return [{ id: typeof item.id === "string" && item.id ? item.id : `skill-imported-${index}`, name: typeof item.name === "string" ? item.name : "", published: item.published !== false }];
  });
  return { ...defaultAqsaJuttProfile, ...parsed,
   skills,
   languages: Array.isArray(parsed.languages) ? parsed.languages : defaultAqsaJuttProfile.languages,
   experience: Array.isArray(parsed.experience) ? parsed.experience : defaultAqsaJuttProfile.experience,
   education: Array.isArray(parsed.education) ? parsed.education : defaultAqsaJuttProfile.education
  };
 } catch { return defaultAqsaJuttProfile; }
}
