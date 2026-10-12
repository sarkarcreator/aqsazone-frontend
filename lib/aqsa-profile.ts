export interface ProfileEntry { id: string; published: boolean; [key: string]: string | boolean; }
export interface AqsaJuttProfile {
  name: string; title: string; intro: string; location: string; published: boolean;
  skills: string[]; languages: Array<{id:string; name:string; level:string; published:boolean}>;
  experience: Array<{id:string; company:string; role:string; duration:string; description:string; period:string; published:boolean}>;
  education: Array<{id:string; degree:string; institution:string; year:string; published:boolean}>;
}
export const defaultAqsaJuttProfile: AqsaJuttProfile = {
 name: "Aqsa Jutt", title: "Content Writer",
 intro: "I am a creative Content Writer, Script Writer, and Video Editor, skilled at turning ideas into engaging words and compelling visuals. I write clear, impactful content and scripts that grab attention, educate viewers, and boost engagement. With strong storytelling and editing skills, I create content that is simple, powerful, and result-focused.",
 location: "Jaranwala Road, Faisalabad", published: true,
 skills: ["Communication","Time management","Organization","Technical skills","Research","Content writing","Video editing","Script writing","Team Work","Copywriting"],
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
  const parsed = JSON.parse(raw) as Partial<AqsaJuttProfile>;
  return { ...defaultAqsaJuttProfile, ...parsed,
   skills: Array.isArray(parsed.skills) ? parsed.skills : defaultAqsaJuttProfile.skills,
   languages: Array.isArray(parsed.languages) ? parsed.languages : defaultAqsaJuttProfile.languages,
   experience: Array.isArray(parsed.experience) ? parsed.experience : defaultAqsaJuttProfile.experience,
   education: Array.isArray(parsed.education) ? parsed.education : defaultAqsaJuttProfile.education
  };
 } catch { return defaultAqsaJuttProfile; }
}
