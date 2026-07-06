export interface Skill {
  name: string
  category: string
  categoryZh: string
  color: SkillColor
}

export type SkillColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'teal'
  | 'indigo'
  | 'rose'
  | 'amber'
  | 'cyan'

export const colorMap: Record<SkillColor, string> = {
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  green:  'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pink:   'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  teal:   'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  rose:   'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  amber:  'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  cyan:   'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
}

export const skills: Skill[] = [
  { name: 'Python',       category: 'Programming Languages', categoryZh: '编程语言', color: 'blue' },
  { name: 'Java',         category: 'Programming Languages', categoryZh: '编程语言', color: 'orange' },
  { name: 'C',            category: 'Programming Languages', categoryZh: '编程语言', color: 'indigo' },
  { name: 'C++',          category: 'Programming Languages', categoryZh: '编程语言', color: 'purple' },
  { name: 'SQL',          category: 'Programming Languages', categoryZh: '编程语言', color: 'teal' },
  { name: 'MySQL',        category: 'Big Data & Databases',  categoryZh: '大数据与数据库', color: 'blue' },
  { name: 'Redis',        category: 'Big Data & Databases',  categoryZh: '大数据与数据库', color: 'rose' },
  { name: 'Hadoop',       category: 'Big Data & Databases',  categoryZh: '大数据与数据库', color: 'amber' },
  { name: 'Spark',        category: 'Big Data & Databases',  categoryZh: '大数据与数据库', color: 'orange' },
  { name: 'Scikit-learn', category: 'ML & Deep Learning',    categoryZh: '机器学习与深度学习', color: 'green' },
  { name: 'XGBoost',      category: 'ML & Deep Learning',    categoryZh: '机器学习与深度学习', color: 'teal' },
  { name: 'PyTorch',      category: 'ML & Deep Learning',    categoryZh: '机器学习与深度学习', color: 'orange' },
  { name: 'Ray',          category: 'ML & Deep Learning',    categoryZh: '机器学习与深度学习', color: 'purple' },
  { name: '特征工程',     category: 'ML & Deep Learning',    categoryZh: '机器学习与深度学习', color: 'pink' },
  { name: '模型调优',     category: 'ML & Deep Learning',    categoryZh: '机器学习与深度学习', color: 'indigo' },
  { name: 'Git',          category: 'Engineering & Tools',   categoryZh: '工程与工具', color: 'orange' },
  { name: 'Linux',        category: 'Engineering & Tools',   categoryZh: '工程与工具', color: 'rose' },
  { name: 'Vite',         category: 'Engineering & Tools',   categoryZh: '工程与工具', color: 'purple' },
  { name: 'Tailwind CSS', category: 'Engineering & Tools',   categoryZh: '工程与工具', color: 'teal' },
  { name: 'Vercel',       category: 'Engineering & Tools',   categoryZh: '工程与工具', color: 'blue' },
]
