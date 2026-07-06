export interface Project {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  techStack: string[]
  image: string
  githubUrl: string
  demoUrl: string
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    name: 'Personal Portfolio Website',
    nameZh: '个人作品集网页搭建',
    description: 'A responsive personal portfolio website built with React, TypeScript, and Tailwind CSS. Features bilingual support (EN/ZH), dark/light theme switching, smooth scroll animations, and mobile-first design. Deployed on Vercel.',
    descriptionZh: '使用 React、TypeScript 和 Tailwind CSS 构建的响应式个人作品集网站。支持中英文双语切换、深浅色主题切换、流畅滚动动画和移动端适配。已部署至 Vercel。',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Vercel'],
    image: '',
    githubUrl: 'https://github.com/PastLives-GIT',
    demoUrl: '#',
  },
  {
    id: 'ctrans-lpre',
    name: 'CTrans-LPRE Federated Transfer Learning',
    nameZh: 'CTrans-LPRE 联邦迁移学习项目',
    description: 'A federated transfer learning system based on CTrans architecture for training multiplicative error models without direct data transfer. Involved algorithm design, estimator implementation, multi-machine cluster setup, and model evaluation. Published in SCI Q2 journal.',
    descriptionZh: '基于 CTrans 架构搭建的不直接传输数据的联邦迁移学习系统，用于训练乘性误差模型。涉及核心算法设计、估计器代码实现、多机群组建与模型训练评估。成果发表于 SCI 二区期刊。',
    techStack: ['Python', 'Ray', 'LPRE', 'Linux', 'Machine Learning', 'Federated Learning', 'Transfer Learning'],
    image: '',
    githubUrl: '#',
    demoUrl: '#',
  },
]
