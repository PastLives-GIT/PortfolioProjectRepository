import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { skills, colorMap } from '../data/skills'

const aboutParagraphsEn = [
  "I'm a Data Science & Big Data Technology undergraduate at China University of Petroleum (East China). My coursework spans data structures, machine learning, statistical analysis, and mathematical modeling — giving me a solid foundation in both theory and practice.",
  "I'm passionate about machine learning, federated learning, and building full-stack web applications. I enjoy tackling complex problems through code, whether it's designing algorithms for scientific research or crafting responsive, bilingual web experiences.",
]
const aboutParagraphsZh = [
  '我是一名中国石油大学（华东）数据科学与大数据技术专业的本科生。我的课程涵盖数据结构、机器学习、统计分析和数学建模，在理论和实践方面都有扎实的基础。',
  '我热爱机器学习、联邦学习和全栈 Web 应用开发。无论是为科研设计算法，还是打造响应式中英双语网页体验，我都乐于通过代码解决复杂问题。',
]

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

function About() {
  const { lang, t } = useLanguage()
  const paragraphs = lang === 'en' ? aboutParagraphsEn : aboutParagraphsZh

  // Group skills by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const key = t(s.category, s.categoryZh)
    ;(acc[key] ??= []).push(s)
    return acc
  }, {})

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <motion.h2
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
        >
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {t('About Me', '关于我')}
          </span>
        </motion.h2>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Intro text */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-2 space-y-4"
          >
            {paragraphs.map((p, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                {p}
              </p>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <span
                        key={skill.name}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default ${colorMap[skill.color]}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
