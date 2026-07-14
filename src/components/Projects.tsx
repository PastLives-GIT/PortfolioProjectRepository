import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { projects, type Project } from '../data/projects'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

const placeholders = [
  'from-purple-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-cyan-500',
  'from-amber-500 to-orange-500',
]

interface CardRect {
  x: number
  y: number
  w: number
}

function ProjectCard({
  project,
  index,
  isExpanded,
  onExpand,
  onCollapse,
  t,
}: {
  project: (typeof projects)[number]
  index: number
  isExpanded: boolean
  onExpand: (rect: CardRect) => void
  onCollapse: () => void
  t: (en: string, zh: string) => string
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const r = cardRef.current.getBoundingClientRect()
      onExpand({ x: r.left, y: r.top, w: r.width })
    }
  }

  const handleClick = () => {
    if (isExpanded) {
      onCollapse()
    } else if (cardRef.current) {
      const r = cardRef.current.getBoundingClientRect()
      onExpand({ x: r.left, y: r.top, w: r.width })
    }
  }

  return (
    <>
      {/* Grid placeholder — always a motion.div to avoid remount on expand/collapse */}
      <motion.div
        ref={cardRef}
        data-project-id={project.id}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        custom={index}
        animate={isExpanded ? { opacity: 0 } : 'visible'}
        transition={isExpanded ? { duration: 0.15 } : { duration: 0.2 }}
        onMouseEnter={isExpanded ? undefined : handleMouseEnter}
        onClick={handleClick}
        className={`rounded-2xl overflow-hidden ${
          isExpanded
            ? 'pointer-events-none invisible'
            : 'cursor-pointer hover:shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <CardInner project={project} index={index} t={t} />
      </motion.div>
    </>
  )
}

function CardInner({
  project,
  index,
  t,
  fullDesc = false,
}: {
  project: Project
  index: number
  t: (en: string, zh: string) => string
  fullDesc?: boolean
}) {
  return (
    <>
      {/* Project image / placeholder */}
      <div
        className={`h-48 bg-gradient-to-br ${placeholders[index % placeholders.length]} flex items-center justify-center shrink-0`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={t(project.name, project.nameZh)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-white/60"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
        )}
      </div>

      {/* Card body */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t(project.name, project.nameZh)}
        </h3>
        <p className={`text-sm text-gray-500 dark:text-gray-400 mb-4 ${fullDesc ? '' : 'line-clamp-2'}`}>
          {t(project.description, project.descriptionZh)}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map(tech => (
            <span key={tech}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
          </a>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {t('Live Demo', '在线演示')}
          </a>
        </div>
      </div>
    </>
  )
}

const COOLDOWN_MS = 150

function Projects() {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState<{ id: string; rect: CardRect } | null>(null)
  const expandedIdRef = useRef<string | null>(null)
  const cooldownRef = useRef<{ until: number; id: string }>({ until: 0, id: '' })
  const mouseRef = useRef({ x: -1000, y: -1000 })

  const handleCollapse = useCallback(() => {
    const id = expandedIdRef.current
    if (id) cooldownRef.current = { until: Date.now() + COOLDOWN_MS, id }
    expandedIdRef.current = null
    setExpanded(null)
  }, [])

  const handleExpand = useCallback((id: string, rect: CardRect) => {
    const cd = cooldownRef.current
    if (cd.id === id && Date.now() < cd.until) return
    expandedIdRef.current = id
    setExpanded({ id, rect })
  }, [])

  // Track mouse position for scroll-into detection
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // On scroll: close expanded card, then check if mouse landed over another card
  useEffect(() => {
    const onScroll = () => {
      if (!expandedIdRef.current) return
      const prevId = expandedIdRef.current
      handleCollapse()
      // Wait one frame for DOM to update, then check what's under the mouse
      requestAnimationFrame(() => {
        const { x, y } = mouseRef.current
        if (x < 0 || y < 0) return
        const els = document.querySelectorAll('[data-project-id]')
        for (const el of els) {
          const rect = el.getBoundingClientRect()
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            const id = el.getAttribute('data-project-id')!
            if (id !== prevId) {
              handleExpand(id, { x: rect.left, y: rect.top, w: rect.width })
            }
            break
          }
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [handleCollapse, handleExpand])

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400 dark:text-gray-500">
          <p className="text-lg">{t('No projects yet.', '暂无项目。')}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16"
        >
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {t('Projects', '项目')}
          </span>
        </motion.h2>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              isExpanded={expanded?.id === project.id}
              onExpand={rect => handleExpand(project.id, rect)}
              onCollapse={handleCollapse}
              t={t}
            />
          ))}
        </div>

        {/* Expanded overlay — fixed layer, doesn't affect grid layout */}
        {expanded && (
          <ExpandedOverlay
            expanded={expanded}
            items={projects}
            onCollapse={handleCollapse}
            t={t}
          />
        )}
      </div>
    </section>
  )
}

function ExpandedOverlay({
  expanded,
  items,
  onCollapse,
  t,
}: {
  expanded: { id: string; rect: CardRect }
  items: Project[]
  onCollapse: () => void
  t: (en: string, zh: string) => string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const project = items.find(p => p.id === expanded.id)!
  const i = items.indexOf(project)
  const { x, y, w } = expanded.rect
  const expW = Math.min(w * 1.08, window.innerWidth - 32)

  // Close on resize
  useEffect(() => {
    window.addEventListener('resize', onCollapse)
    return () => window.removeEventListener('resize', onCollapse)
  }, [onCollapse])

  // Close on click outside the expanded card
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onCollapse()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onCollapse])

  // Position the overlay centered on the original card's horizontal midpoint,
  // then use scale (GPU transform) for the size change — no left/width animation.
  const centerX = x + w / 2

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 0, scale: 0.97 }}
      animate={{ opacity: 1, y: -8, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }}
      className="fixed z-40 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/15"
      style={{
        left: centerX - expW / 2,
        top: y,
        width: expW,
        transformOrigin: 'center top',
      }}
      onMouseLeave={onCollapse}
    >
      <CardInner project={project} index={i} t={t} fullDesc />
    </motion.div>
  )
}

export default Projects
