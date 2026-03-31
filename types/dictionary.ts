/** Auto-generated type from the dictionary JSON structure (3.1, 3.2) */

export interface Dictionary {
  nav: {
    home: string
    resume: string
    work: string
    blog: string
    contact: string
  }
  common: {
    hireMe: string
    downloadCV: string
    backToHome: string
    contactMe: string
  }
  home: {
    greeting: string
    description: string
    whatIDo: string
    findOutAboutMe: string
    whyWorkWithMe: string
  }
  skills: {
    seo: { key: string; title: string; body: string }
    frontend: { key: string; title: string; body: string }
    backend: { key: string; title: string; body: string }
    teaching: { key: string; title: string; body: string }
  }
  whyMe: {
    problemSolving: { title: string; description: string }
    fastService: { title: string; description: string }
    secureSolutions: { title: string; description: string }
    transparent: { title: string; description: string }
  }
  stats: {
    yearsOfExperience: string
    projectsCompleted: string
    technologiesMastered: string
    codeCommits: string
  }
  blog: {
    pageTitle: string
    pageDescription: string
    featured: string
    allPosts: string
    backToArticles: string
    onThisPage: string
    shareArticle: string
    enjoyedArticle: string
    enjoyedDescription: string
    readMoreArticles: string
    getInTouch: string
    moreArticles: string
    recommended: string
    authorBio: string
    published: string
    searchPlaceholder: string
    allCategories: string
    resultsFound: string
    noResults: string
    readNext: string
    featuredArticles: string
    noArticles: string
    twitter: string
    linkedin: string
    facebook: string
    copyLink: string
    copied: string
    clickToCopyLine: string
  }
  contact: {
    title: string
    description: string
    firstname: string
    lastname: string
    email: string
    phone: string
    message: string
    send: string
    sending: string
    selectService: string
    serviceOptions: {
      webDev: string
      seo: string
      teaching: string
      tutoring: string
    }
    infoLabels: {
      phone: string
      email: string
      address: string
    }
  }
  resume: {
    experience: string
    education: string
    skills: string
    certifications: string
    aboutMe: string
    myExperience: string
    experienceDesc: string
    myEducation: string
    educationDesc: string
    mySkills: string
    skillsDesc: string
    myCertifications: string
    certificationsDesc: string
    viewCredential: string
    aboutTitle: string
    aboutDesc: string
  }
  work: {
    pageTitle: string
    pageDesc: string
    liveProject: string
    githubRepo: string
    project: string
    caseStudy: string
    challenge: string
    approach: string
    result: string
  }
  notFound: {
    code: string
    title: string
    description: string
  }
  footer: {
    tagline: string
    quickLinks: string
    connect: string
    email: string
    rights: string
    builtWith: string
  }
  errors: {
    somethingWentWrong: string
    unexpectedError: string
    tryAgain: string
    backToHome: string
    failedToLoadArticle: string
    articleCouldNotBeLoaded: string
    retry: string
    allArticles: string
  }
  mySelf: string[]
}
