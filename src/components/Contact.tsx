import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

const contactEmail = 'liu20060309@outlook.com'

const iconCls = 'w-5 h-5'

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconCls}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={iconCls}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconCls}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}

// Pre-built contact items (outside component to avoid recreation)
// TODO: add more links (e.g. LinkedIn) if needed
interface ContactItem {
  id: string
  label: string
  labelZh: string
  value: string
  href?: string
  copy?: boolean
  icon: React.ReactNode
}

const contactItems: ContactItem[] = [
  {
    id: 'email',
    label: 'Email', labelZh: '邮箱',
    value: contactEmail,
    copy: true,
    icon: <EmailIcon />,
  },
  {
    id: 'github',
    label: 'GitHub', labelZh: 'GitHub',
    value: 'github.com/PastLives-GIT',
    href: 'https://github.com/PastLives-GIT',
    icon: <GitHubIcon />,
  },
]

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

function Contact() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
        >
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {t('Contact', '联系方式')}
          </span>
        </motion.h2>

        {/* Contact list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm"
        >
          {contactItems.map((item, i) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              {item.copy ? (
                <button
                  onClick={handleCopyEmail}
                  className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <span className="shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                      {t(item.label, item.labelZh)}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.value}
                    </p>
                  </div>
                  {copied ? (
                    <span className="shrink-0 text-xs text-green-500 font-medium animate-pulse">
                      {t('Copied!', '已复制！')}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 group-hover:text-purple-400 transition-colors">
                      {t('Click to copy', '点击复制')}
                    </span>
                  )}
                </button>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <span className="shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors">
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                      {t(item.label, item.labelZh)}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.value}
                    </p>
                  </div>
                  <span className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-purple-400 transition-colors">
                    <ExternalLinkIcon />
                  </span>
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          {t(
            'Feel free to reach out — I\'m always open to new opportunities.',
            '欢迎联系我 — 我始终对新机会保持开放态度。',
          )}
        </p>
      </div>
    </section>
  )
}

export default Contact
