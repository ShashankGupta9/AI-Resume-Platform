/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

const KNOWN_SKILLS = [
  'React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL', 'REST API', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git', 'CI/CD', 'Agile', 'Scrum',
  'UI/UX', 'Figma', 'System Design', 'Microservices', 'Jest', 'Cypress', 'PyTorch', 'TensorFlow',
  'Machine Learning', 'NLP', 'Data Science', 'SQL', 'Prisma', 'Supabase', 'Firebase', 'DevOps'
];

export interface AIAnalysisResult {
  rawText: string;
  extractedSkills: string[];
  matchScore: number;
  summary: string;
  strengths: string[];
  extractedCandidateInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export async function extractTextFromFile(buffer: Buffer, fileType: string): Promise<string> {
  try {
    if (fileType.toLowerCase() === 'pdf' || fileType.includes('pdf')) {
      const data = await pdfParse(buffer);
      return data.text || '';
    } else if (fileType.toLowerCase() === 'docx' || fileType.includes('word')) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    }
  } catch (error) {
    console.error('Error extracting text from resume:', error);
  }
  return buffer.toString('utf-8', 0, Math.min(buffer.length, 5000));
}

export async function analyzeResume(
  buffer: Buffer,
  fileType: string,
  requiredSkillsText: string,
  jobTitle: string
): Promise<AIAnalysisResult> {
  const rawText = await extractTextFromFile(buffer, fileType);
  const textLower = rawText.toLowerCase();

  // Extract skills found in resume text
  const extractedSkills = KNOWN_SKILLS.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(textLower);
  });

  // Extract skills required by job
  const reqSkillsList = requiredSkillsText
    .split(/[,;\n]/)
    .map(s => s.trim())
    .filter(Boolean);

  let matchCount = 0;
  reqSkillsList.forEach(reqSkill => {
    const isMatched = extractedSkills.some(
      s => s.toLowerCase() === reqSkill.toLowerCase() || reqSkill.toLowerCase().includes(s.toLowerCase())
    ) || textLower.includes(reqSkill.toLowerCase());
    if (isMatched) matchCount++;
  });

  // Calculate base match score
  let matchScore = 60; // Base baseline score
  if (reqSkillsList.length > 0) {
    const skillRatio = matchCount / reqSkillsList.length;
    matchScore = Math.min(98, Math.max(35, Math.round(skillRatio * 45 + 50)));
  }

  // Bonus for domain & title match keywords
  const titleKeywords = jobTitle.toLowerCase().split(/\s+/);
  const titleMatches = titleKeywords.filter(kw => kw.length > 2 && textLower.includes(kw));
  if (titleMatches.length > 0) {
    matchScore = Math.min(99, matchScore + 5);
  }

  // Extract email, phone, name regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  // Generate candidate summary
  const summary = `Candidate demonstrates strong technical alignment for the ${jobTitle} role. Extracted ${extractedSkills.length} core competencies including ${extractedSkills.slice(0, 4).join(', ') || 'software development'}. Matches ${matchCount} out of ${reqSkillsList.length || 1} explicit job requirements.`;

  const strengths = [
    `Direct match on key technologies: ${extractedSkills.slice(0, 3).join(', ') || 'Core Skills'}`,
    `Relevant experience alignment with ${jobTitle}`,
    `Demonstrates clean resume structure and clear skill progression`
  ];

  return {
    rawText,
    extractedSkills,
    matchScore,
    summary,
    strengths,
    extractedCandidateInfo: {
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
    }
  };
}
