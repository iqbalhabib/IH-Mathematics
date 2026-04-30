export interface CurriculumSection {
  section: string;
  lessons: string[];
}

export interface Course {
  id: string;
  category: "O Level" | "A Level" | "GRE";
  badge: string;
  badgeColor: string;
  icon: string;
  bg: string;
  symbol: string;
  title: string;
  subtitle: string;
  desc: string;
  longDesc: string;
  instructor: string;
  lessons: number;
  duration: string;
  students: number;
  rating: number;
  tag: string | null;
  tagColor: string;
  topics: string[];
  level: string;
  whatYouLearn: string[];
  prerequisites: string[];
  curriculum: CurriculumSection[];
}

export const courses: Course[] = [
  {
    id: "o-level-math",
    category: "O Level",
    badge: "O Level",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: "📐",
    bg: "from-blue-100 via-indigo-50 to-sky-100",
    symbol: "∑",
    title: "Mathematics (0580)",
    subtitle: "Cambridge O Level",
    desc: "Full syllabus coverage — number, algebra, geometry, mensuration, trigonometry, probability, and statistics.",
    longDesc:
      "This comprehensive course covers the complete Cambridge O Level Mathematics (0580) syllabus. Whether you're aiming for a grade B or a perfect A*, our structured lessons take you from foundational number theory all the way to advanced statistics and probability, with hundreds of practice questions and exam techniques built in throughout.",
    instructor: "Habib Iqbal",
    lessons: 24,
    duration: "48 hrs",
    students: 312,
    rating: 4.9,
    tag: "Most Popular",
    tagColor: "bg-emerald-100 text-emerald-700",
    topics: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
    level: "Beginner – Intermediate",
    whatYouLearn: [
      "Solve linear and quadratic equations confidently",
      "Apply Pythagoras and trigonometry to real-world problems",
      "Work with circle theorems and geometric proofs",
      "Calculate probability and interpret statistical data",
      "Tackle all question types in the O Level exam paper",
    ],
    prerequisites: [
      "Basic arithmetic (primary school level)",
      "No prior algebra needed — we start from scratch",
    ],
    curriculum: [
      {
        section: "Number",
        lessons: [
          "Types of Numbers & Number Lines",
          "Fractions, Decimals & Percentages",
          "Ratios & Proportions",
          "Standard Form & Estimation",
        ],
      },
      {
        section: "Algebra",
        lessons: [
          "Expressions & Simplification",
          "Linear Equations & Inequalities",
          "Simultaneous Equations",
          "Quadratic Equations & The Formula",
          "Sequences & Patterns",
        ],
      },
      {
        section: "Geometry & Mensuration",
        lessons: [
          "Angles & Parallel Lines",
          "Triangles & Polygons",
          "Circle Theorems",
          "Area & Perimeter",
          "Volume & Surface Area",
          "Transformations",
        ],
      },
      {
        section: "Trigonometry",
        lessons: [
          "SOH-CAH-TOA",
          "Sine Rule & Cosine Rule",
          "Bearings & Angles of Elevation",
        ],
      },
      {
        section: "Statistics & Probability",
        lessons: [
          "Data Representation & Charts",
          "Mean, Median & Mode",
          "Cumulative Frequency & Box Plots",
          "Probability & Venn Diagrams",
        ],
      },
    ],
  },
  {
    id: "o-level-add-math",
    category: "O Level",
    badge: "O Level",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: "📏",
    bg: "from-sky-100 via-blue-50 to-indigo-100",
    symbol: "∫",
    title: "Additional Mathematics (0606)",
    subtitle: "Cambridge O Level",
    desc: "Bridge the gap between O and A Level — functions, calculus intro, trigonometry, matrices, and vectors.",
    longDesc:
      "Additional Mathematics (0606) is the essential bridge between O Level and A Level. This course builds deep algebraic reasoning, introduces differentiation and integration, and covers advanced trigonometry. Perfect for students planning to continue to A Level Mathematics or who want the strongest possible maths foundation.",
    instructor: "Habib Iqbal",
    lessons: 18,
    duration: "36 hrs",
    students: 189,
    rating: 4.8,
    tag: null,
    tagColor: "",
    topics: ["Functions", "Calculus Intro", "Matrices", "Vectors"],
    level: "Intermediate",
    whatYouLearn: [
      "Understand and manipulate functions and their graphs",
      "Differentiate and integrate polynomial expressions",
      "Apply advanced trigonometric identities",
      "Work with matrices and their transformations",
      "Solve vector problems in two dimensions",
    ],
    prerequisites: [
      "O Level Mathematics (0580) or equivalent",
      "Comfortable with algebraic manipulation",
    ],
    curriculum: [
      {
        section: "Functions",
        lessons: [
          "Domain, Range & Mappings",
          "Composite & Inverse Functions",
          "Modulus Functions & Graphs",
        ],
      },
      {
        section: "Algebra",
        lessons: [
          "Polynomials & Remainder Theorem",
          "Equations & Inequalities",
          "Binomial Theorem (intro)",
        ],
      },
      {
        section: "Calculus",
        lessons: [
          "Differentiation Rules",
          "Gradient, Tangents & Normals",
          "Integration as Reverse Differentiation",
          "Definite Integrals & Area Under a Curve",
        ],
      },
      {
        section: "Trigonometry",
        lessons: [
          "Radian Measure",
          "Trigonometric Identities",
          "Solving Trigonometric Equations",
        ],
      },
      {
        section: "Vectors & Matrices",
        lessons: [
          "Vector Operations in 2D",
          "Matrix Multiplication",
          "Matrix Transformations",
        ],
      },
    ],
  },
  {
    id: "a-level-pure",
    category: "A Level",
    badge: "A Level",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: "🔢",
    bg: "from-purple-100 via-indigo-50 to-violet-100",
    symbol: "∂",
    title: "Pure Mathematics 1 & 2 (9709)",
    subtitle: "Cambridge A Level",
    desc: "Deep-dive into pure maths — differentiation, integration, binomial theorem, complex numbers, and series.",
    longDesc:
      "This course covers the full Pure Mathematics 1 & 2 syllabi for Cambridge A Level (9709 P1 & P2). From advanced calculus techniques to complex numbers and numerical methods, every topic is taught with examination-focused practice and clear explanations that go beyond the textbook.",
    instructor: "Habib Iqbal",
    lessons: 32,
    duration: "64 hrs",
    students: 156,
    rating: 4.9,
    tag: "New",
    tagColor: "bg-indigo-100 text-indigo-700",
    topics: ["Calculus", "Binomial Theorem", "Series", "Numerical Methods"],
    level: "Advanced",
    whatYouLearn: [
      "Master advanced differentiation and integration techniques",
      "Work with logarithms and exponential functions",
      "Sum series using standard sigma notation results",
      "Solve differential equations with boundary conditions",
      "Apply A Level exam strategies for a top grade",
    ],
    prerequisites: [
      "O Level Additional Mathematics or equivalent",
      "Strong algebraic foundation",
    ],
    curriculum: [
      {
        section: "Pure 1 — Core Topics",
        lessons: [
          "Quadratics & Polynomials",
          "Coordinate Geometry of Lines & Circles",
          "Circular Measure",
          "Trigonometry (P1)",
          "Vectors in 3D",
          "Series & Sigma Notation",
          "Differentiation (P1)",
          "Integration (P1)",
        ],
      },
      {
        section: "Pure 2 — Advanced Topics",
        lessons: [
          "Algebra & Logarithms",
          "Trigonometry (P2 — identities & equations)",
          "Differentiation (implicit, parametric, chain rule)",
          "Integration (by parts, substitution, partial fractions)",
          "Numerical Methods",
          "Differential Equations",
        ],
      },
    ],
  },
  {
    id: "a-level-stats",
    category: "A Level",
    badge: "A Level",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: "📊",
    bg: "from-violet-100 via-purple-50 to-fuchsia-100",
    symbol: "σ",
    title: "Statistics 1 & 2 (9709)",
    subtitle: "Cambridge A Level",
    desc: "Probability distributions, hypothesis testing, correlation, regression, and statistical inference.",
    longDesc:
      "Statistics for Cambridge A Level (9709 S1 & S2) teaches you to reason with data — from probability and distributions all the way to hypothesis testing and statistical inference. Essential for any student taking the full A Level Mathematics or Further Mathematics qualification.",
    instructor: "Habib Iqbal",
    lessons: 20,
    duration: "40 hrs",
    students: 98,
    rating: 4.7,
    tag: null,
    tagColor: "",
    topics: ["Probability", "Distributions", "Hypothesis Testing", "Regression"],
    level: "Advanced",
    whatYouLearn: [
      "Calculate probabilities using permutations and combinations",
      "Apply Binomial and Normal distributions",
      "Conduct hypothesis tests with correct statistical conclusions",
      "Analyse correlation and fit regression lines",
      "Interpret statistical results accurately in context",
    ],
    prerequisites: [
      "O Level Mathematics",
      "Some familiarity with graphs and data interpretation",
    ],
    curriculum: [
      {
        section: "Statistics 1",
        lessons: [
          "Representation of Data",
          "Permutations & Combinations",
          "Probability",
          "Discrete Random Variables",
          "Normal Distribution",
          "Sampling & Estimation",
        ],
      },
      {
        section: "Statistics 2",
        lessons: [
          "Binomial & Poisson Distributions",
          "Continuous Random Variables",
          "Sampling Distributions",
          "Hypothesis Testing",
          "Correlation & Regression",
        ],
      },
    ],
  },
  {
    id: "a-level-mechanics",
    category: "A Level",
    badge: "A Level",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: "⚡",
    bg: "from-amber-100 via-orange-50 to-yellow-100",
    symbol: "F",
    title: "Mechanics 1 (9709)",
    subtitle: "Cambridge A Level",
    desc: "Kinematics, forces, Newton's laws, moments, energy, work, and power for A Level mechanics.",
    longDesc:
      "Mechanics 1 (9709 M1) introduces the mathematical study of forces and motion. You will model real-world scenarios — from projectile motion to systems in equilibrium — using Newton's laws, energy conservation, and momentum principles.",
    instructor: "Habib Iqbal",
    lessons: 16,
    duration: "32 hrs",
    students: 74,
    rating: 4.8,
    tag: "Coming Soon",
    tagColor: "bg-amber-100 text-amber-700",
    topics: ["Kinematics", "Forces", "Newton's Laws", "Energy"],
    level: "Advanced",
    whatYouLearn: [
      "Analyse linear and projectile motion using SUVAT equations",
      "Resolve forces and model a particle in equilibrium",
      "Apply Newton's three laws to connected particle problems",
      "Calculate work, energy, and power in mechanical systems",
      "Solve friction, impulse, and momentum problems",
    ],
    prerequisites: [
      "Pure Mathematics 1 (differentiation & vectors)",
      "O Level Physics is helpful but not required",
    ],
    curriculum: [
      {
        section: "Kinematics",
        lessons: [
          "Displacement, Velocity & Acceleration",
          "SUVAT Equations of Motion",
          "Velocity-Time Graphs",
          "Projectile Motion",
        ],
      },
      {
        section: "Forces & Equilibrium",
        lessons: [
          "Types of Forces",
          "Resolving Forces in Two Directions",
          "Equilibrium of a Particle",
          "Friction & Coefficient of Friction",
        ],
      },
      {
        section: "Newton's Laws & Connected Particles",
        lessons: [
          "Newton's 1st, 2nd & 3rd Laws",
          "Connected Particles & Pulleys",
          "Momentum & Impulse",
        ],
      },
      {
        section: "Energy, Work & Power",
        lessons: [
          "Work Done by a Force",
          "Kinetic & Potential Energy",
          "Conservation of Energy",
          "Power",
        ],
      },
    ],
  },
  {
    id: "gre-quant",
    category: "GRE",
    badge: "GRE",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: "🎯",
    bg: "from-emerald-100 via-teal-50 to-green-100",
    symbol: "%",
    title: "GRE Quantitative Reasoning",
    subtitle: "Graduate Record Examination",
    desc: "Arithmetic, algebra, geometry, and data analysis — targeted prep for the GRE Quant section.",
    longDesc:
      "This GRE Quantitative Reasoning course gives you complete coverage of every topic on the GRE Quant syllabus — from arithmetic and number properties to geometry and data interpretation. Learn the most efficient strategies for each question type and build the confidence to achieve a top Quant score.",
    instructor: "Habib Iqbal",
    lessons: 28,
    duration: "56 hrs",
    students: 67,
    rating: 4.9,
    tag: "New",
    tagColor: "bg-teal-100 text-teal-700",
    topics: ["Arithmetic", "Algebra", "Geometry", "Data Analysis"],
    level: "Intermediate – Advanced",
    whatYouLearn: [
      "Master all GRE arithmetic and number theory topics",
      "Solve algebra and function problems efficiently",
      "Apply geometry formulas with speed and accuracy",
      "Interpret data analysis and statistics questions",
      "Use elimination and strategic guessing where appropriate",
    ],
    prerequisites: [
      "High school level mathematics",
      "No calculus required",
    ],
    curriculum: [
      {
        section: "Arithmetic & Number Properties",
        lessons: [
          "Integers & Divisibility",
          "Fractions, Decimals & Percentages",
          "Ratio & Proportion",
          "Exponents & Roots",
          "Estimation & Rounding",
        ],
      },
      {
        section: "Algebra",
        lessons: [
          "Linear Equations & Inequalities",
          "Quadratics & Factoring",
          "Functions & Graphs",
          "Sequences & Word Problems",
        ],
      },
      {
        section: "Geometry",
        lessons: [
          "Lines, Angles & Triangles",
          "Quadrilaterals & Polygons",
          "Circles & Area",
          "3D Geometry",
          "Coordinate Geometry",
        ],
      },
      {
        section: "Data Analysis",
        lessons: [
          "Tables & Graphs",
          "Descriptive Statistics",
          "Probability",
          "Combinations & Permutations",
          "Data Interpretation Strategies",
        ],
      },
    ],
  },
];
