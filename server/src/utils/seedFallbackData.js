// Academic taxonomy domains and topics according to Master Build Specification
export const TAXONOMY_DOMAINS = [
  {
    id: "computer_science",
    name: "Computer Science & Engineering",
    disciplines: [
      {
        name: "Operating Systems",
        topics: ["Virtual Memory", "CPU Scheduling", "Deadlocks", "Process Synchronization", "File Systems"]
      },
      {
        name: "Data Structures & Algorithms",
        topics: ["Dynamic Programming", "Graph Traversal", "Self-Balancing Trees", "Asymptotic Analysis"]
      }
    ]
  },
  {
    id: "mechanical_engineering",
    name: "Mechanical Engineering",
    disciplines: [
      {
        name: "Thermodynamics",
        topics: ["First Law & Energy Conservation", "Second Law & Entropy", "Carnot Cycles", "Pure Substances & Phase Diagrams"]
      },
      {
        name: "Fluid Mechanics",
        topics: ["Bernoulli Principle", "Navier-Stokes Equations", "Laminar vs Turbulent Flow", "Boundary Layer Theory"]
      }
    ]
  },
  {
    id: "electrical_engineering",
    name: "Electrical & Electronics Engineering",
    disciplines: [
      {
        name: "Signals & Systems",
        topics: ["Fourier Transform", "Convolution", "Laplace Transform", "Z-Transform", "LTI Systems"]
      }
    ]
  }
];

// Curated Seed Video Repository for STEM topics
export const SEED_VIDEOS = {
  "Thermodynamics": [
    {
      youtube_video_id: "O8Ruv4x3FEY",
      title: "First Law of Thermodynamics & Internal Energy Derivation",
      channel_title: "MIT OpenCourseWare",
      description: "Comprehensive university lecture on microscopic kinetic energy, heat transfer sign conventions, state functions, and PV work in closed vs open thermodynamic systems.",
      thumbnail_url: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 1840,
      sequence_order: 1,
      core_concepts: ["State Functions", "First Law Energy Balance", "Path Dependence of Work", "Enthalpy Definition"]
    },
    {
      youtube_video_id: "g7B8m0b5K7A",
      title: "Second Law of Thermodynamics, Entropy & Microstates",
      channel_title: "Stanford Engineering",
      description: "Rigorous mechanical engineering breakdown of Clausius inequality, reversible vs irreversible entropy generation, Boltzmann microstate formulation, and heat engine efficiency limits.",
      thumbnail_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2210,
      sequence_order: 2,
      core_concepts: ["Entropy Generation", "Clausius Inequality", "Irreversibility", "Statistical Microstates"]
    },
    {
      youtube_video_id: "M0Fw-1A5Gxk",
      title: "Carnot Thermal Cycles & Maximum Isentropic Efficiency",
      channel_title: "NPTEL Mechanical Lectures",
      description: "Mathematical derivation of the four Carnot cycle processes (isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression) and thermal efficiency upper bounds.",
      thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 1980,
      sequence_order: 3,
      core_concepts: ["Carnot Efficiency", "Isentropic Processes", "Reversible Heat Addition", "Temperature Scale"]
    },
    {
      youtube_video_id: "F3Qj6v8Ym2E",
      title: "Pure Substances, Vapor Domes & Property Evaluation (P-v-T Diagrams)",
      channel_title: "UC Berkeley College of Engineering",
      description: "Evaluation of thermodynamic state using superheated vapor, compressed liquid, and saturated mixture tables with steam quality calculations.",
      thumbnail_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 1720,
      sequence_order: 4,
      core_concepts: ["Phase Diagrams", "Vapor Quality (x)", "Superheated Vapor", "Saturation Pressure"]
    }
  ],
  "Operating Systems": [
    {
      youtube_video_id: "2i2N_Qo_Vzg",
      title: "Virtual Memory Architecture, Paging & Translation Lookaside Buffers (TLB)",
      channel_title: "MIT Computer Science 6.004",
      description: "In-depth engineering lecture on virtual address translation, multi-level page tables, TLB hit/miss penalties, page faults, and hardware memory management unit (MMU) operations.",
      thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2450,
      sequence_order: 1,
      core_concepts: ["Virtual Address Translation", "Multi-Level Paging", "TLB Miss Penalty", "Page Fault Handling"]
    },
    {
      youtube_video_id: "8c7E9t9kR1A",
      title: "Process Synchronization: Mutex Locks, Semaphores & Race Conditions",
      channel_title: "Stanford CS140 Operating Systems",
      description: "Detailed analysis of critical sections, atomic test-and-set instructions, counting vs binary semaphores, priority inversion, and Peterson's algorithm.",
      thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2100,
      sequence_order: 2,
      core_concepts: ["Race Conditions", "Binary Semaphores", "Atomic Instructions", "Priority Inversion"]
    },
    {
      youtube_video_id: "q8K2uL9iF2Q",
      title: "Deadlock Detection, Prevention & Dijkstra's Banker's Algorithm",
      channel_title: "Carnegie Mellon CS",
      description: "Formal analysis of Coffman conditions (mutual exclusion, hold and wait, no preemption, circular wait) and safe state verification using matrix operations in the Banker's algorithm.",
      thumbnail_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 1890,
      sequence_order: 3,
      core_concepts: ["Coffman Conditions", "Banker's Algorithm", "Resource Allocation Graph", "Safe State Evaluation"]
    },
    {
      youtube_video_id: "w4r7_P9kM8E",
      title: "CPU Scheduling Algorithms: Preemption, CFS & Multi-Level Feedback Queues",
      channel_title: "UC Berkeley CS162",
      description: "Comparative study of Round Robin, Shortest Job First, Completely Fair Scheduler (CFS) vruntime trees, and aging mechanisms to prevent starvation.",
      thumbnail_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 1950,
      sequence_order: 4,
      core_concepts: ["Completely Fair Scheduler", "Preemptive Scheduling", "Starvation & Aging", "Turnaround Time"]
    }
  ],
  "Data Structures & Algorithms": [
    {
      youtube_video_id: "oBt53YbR9Kk",
      title: "Dynamic Programming: Optimal Substructure & Overlapping Subproblems",
      channel_title: "MIT 6.006 Introduction to Algorithms",
      description: "Mastery lecture covering memoization vs bottom-up tabulation, DAG topological ordering in subproblem graphs, and state-transition recurrence relations.",
      thumbnail_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2280,
      sequence_order: 1,
      core_concepts: ["Optimal Substructure", "Memoization vs Tabulation", "Recurrence Relations", "DAG Shortest Paths"]
    },
    {
      youtube_video_id: "zaBhtODEL0w",
      title: "Graph Algorithms: Dijkstra, Bellman-Ford & Negative Cycle Detection",
      channel_title: "Stanford CS Algorithms",
      description: "Greedy relaxation, min-heap priority queues, edge relaxation invariants, and dynamic programming on shortest paths with negative weights.",
      thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2160,
      sequence_order: 2,
      core_concepts: ["Dijkstra Relaxation Invariant", "Bellman-Ford Dynamic Step", "Negative Cycles", "Priority Queue Complexity"]
    },
    {
      youtube_video_id: "vR7vK6v8Ym1",
      title: "Self-Balancing Binary Search Trees: AVL Trees & Red-Black Invariants",
      channel_title: "Harvard CS50 / CS124",
      description: "Height-balance factors, single/double tree rotations, black-height invariants, and worst-case logarithmic search/insert guarantees.",
      thumbnail_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2040,
      sequence_order: 3,
      core_concepts: ["AVL Balance Factor", "Tree Rotations", "Red-Black Invariants", "Logarithmic Bounds"]
    }
  ],
  "Signals & Systems": [
    {
      youtube_video_id: "spUNpyF58BY",
      title: "Continuous-Time Fourier Transform: Frequency Domain Representations",
      channel_title: "MIT 6.003 Signals and Systems",
      description: "Fourier transform derivation, duality properties, spectral decomposition of aperiodic continuous signals, and bandwidth modulation.",
      thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 2400,
      sequence_order: 1,
      core_concepts: ["Fourier Duality", "Spectral Density", "Continuous Convolution", "LTI Impulse Response"]
    },
    {
      youtube_video_id: "KuXjwB4LzSA",
      title: "Convolution Integral & Linear Time-Invariant (LTI) System Response",
      channel_title: "Stanford Electrical Engineering",
      description: "Step-by-step graphical convolution, causality, BIBO stability criteria in the time domain, and Dirac impulse responses.",
      thumbnail_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      duration_seconds: 1980,
      sequence_order: 2,
      core_concepts: ["Convolution Integral", "BIBO Stability", "Causality", "Dirac Delta Response"]
    }
  ]
};

// Seed Diagnostic Quizzes with high-precision engineering questions
export const SEED_QUIZZES = {
  "Thermodynamics": {
    title: "Thermodynamics Sub-Concept Diagnostic Assessment",
    topic: "Thermodynamics",
    questions: [
      {
        micro_concept: "State Functions vs Path Functions",
        difficulty: "Basic",
        question_text: "Which of the following physical quantities is a true state function rather than a path-dependent boundary interaction?",
        options: [
          "Shaft Work (W)",
          "Heat Transfer (Q)",
          "Specific Internal Energy (u)",
          "Frictional Dissipation (Q_irr)"
        ],
        correct_option_index: 2,
        explanation: "Specific internal energy (u) depends solely on the equilibrium state coordinates (e.g. T and P) of the system, not on the path traversed. Work and heat are boundary interactions and path functions.",
        distractor_rationales: {
          "0": "Shaft work is a path function whose integral depends directly on the process trajectory (integral of P dV).",
          "1": "Heat transfer is an energy exchange across boundaries that depends on the mechanism and path taken.",
          "3": "Frictional dissipation is irreversible path generation and not an intrinsic thermodynamic property."
        }
      },
      {
        micro_concept: "First Law Closed System Balance",
        difficulty: "Conceptual",
        question_text: "During an isothermal expansion of an ideal gas from state 1 to state 2, how does heat transfer (Q) relate to boundary work (W)?",
        options: [
          "Q = 0 because temperature is held constant",
          "Q = W because internal energy change is zero for an ideal gas at constant temperature",
          "Q = -W because energy must balance without enthalpy change",
          "W = 0 because isothermal processes cannot perform expansion work"
        ],
        correct_option_index: 1,
        explanation: "For an ideal gas, internal energy depends only on temperature: Delta U = m * c_v * Delta T. Since Delta T = 0, Delta U = 0. By the First Law: Delta U = Q - W => Q = W.",
        distractor_rationales: {
          "0": "Confuses an isothermal process (Delta T = 0) with an adiabatic process (Q = 0).",
          "2": "Violates the First Law sign convention: if a gas expands (W > 0), heat must be absorbed (Q > 0) to maintain constant temperature.",
          "3": "Isothermal expansion performs boundary work equal to m * R * T * ln(V2/V1)."
        }
      },
      {
        micro_concept: "Carnot Thermal Efficiency",
        difficulty: "Application",
        question_text: "A proposed heat engine operates between reservoirs at 600 K and 300 K. The inventor claims it absorbs 1000 kJ of heat from the high-temperature reservoir and produces 600 kJ of net work. What does thermodynamic law dictate about this claim?",
        options: [
          "The claim is valid because 600 kJ / 1000 kJ = 60%, which is well below 100%",
          "The claim violates the Second Law because Carnot efficiency is 50%, setting the maximum theoretical limit",
          "The claim violates the First Law because energy was created during cycle execution",
          "The claim is valid provided the working fluid undergoes isentropic expansion"
        ],
        correct_option_index: 1,
        explanation: "Carnot maximum theoretical efficiency eta_max = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 0.50 (50%). The claimed efficiency is 600 / 1000 = 60%, which exceeds the Carnot limit and strictly violates the Second Law.",
        distractor_rationales: {
          "0": "Falls for the misconception that any efficiency under 100% satisfies thermodynamics, ignoring the Carnot temperature-ratio limit.",
          "2": "The First Law is satisfied (1000 kJ in = 600 kJ work + 400 kJ heat rejected), but the Second Law is broken.",
          "3": "No reversible or isentropic process can exceed the Carnot efficiency between two fixed thermal reservoirs."
        }
      },
      {
        micro_concept: "Entropy Generation in Irreversible Processes",
        difficulty: "Conceptual",
        question_text: "In an isolated system undergoing an irreversible spontaneous change, what must be true regarding the change in total entropy (Delta S_total)?",
        options: [
          "Delta S_total < 0, as entropy spontaneously concentrates into work",
          "Delta S_total = 0, because the system is thermally and mechanically isolated",
          "Delta S_total > 0, because internal irreversibilities generate positive entropy",
          "Delta S_total depends entirely on whether the system is ideal gas or real gas"
        ],
        correct_option_index: 2,
        explanation: "By the Second Law of Thermodynamics (Principle of Increase of Entropy), for any isolated system, Delta S_system = S_gen. For irreversible processes, entropy generation S_gen is strictly positive (> 0).",
        distractor_rationales: {
          "0": "Violates the Second Law; entropy of an isolated system can never decrease.",
          "1": "Delta S = 0 only holds for a reversible process in an isolated system. Real processes generate entropy.",
          "3": "The principle of entropy increase is universal and independent of fluid constitution."
        }
      },
      {
        micro_concept: "Pure Substances & Vapor Quality",
        difficulty: "Application",
        question_text: "A rigid tank holds water at a pressure of 100 kPa with a vapor quality x = 0.40. If saturated liquid specific volume v_f = 0.001 m^3/kg and saturated vapor v_g = 1.694 m^3/kg, what is the average specific volume v of the mixture?",
        options: [
          "0.6782 m^3/kg",
          "0.8475 m^3/kg",
          "1.0164 m^3/kg",
          "0.4000 m^3/kg"
        ],
        correct_option_index: 0,
        explanation: "The two-phase mixture specific volume is calculated as: v = v_f + x * (v_g - v_f) = 0.001 + 0.40 * (1.694 - 0.001) = 0.001 + 0.40 * 1.693 = 0.001 + 0.6772 = 0.6782 m^3/kg.",
        distractor_rationales: {
          "1": "Arithmetic error taking the simple midpoint of vapor and liquid specific volumes.",
          "2": "Incorrectly computed using (1 - x) weighting on vapor volume.",
          "3": "Confused vapor quality percentage directly with volumetric fraction."
        }
      },
      {
        micro_concept: "State Functions vs Path Functions",
        difficulty: "Conceptual",
        question_text: "Why is the cyclic integral of any state function property psi around a closed thermodynamic cycle identically zero (oint d psi = 0)?",
        options: [
          "Because all thermodynamic cycles must be 100% reversible to complete a cycle",
          "Because initial and final states are identical, and state functions depend solely on equilibrium coordinates",
          "Because work and heat always cancel each other out over any cycle",
          "Because entropy generation is zero over a complete thermodynamic loop"
        ],
        correct_option_index: 1,
        explanation: "A state function's differential is exact (d psi). Over any closed cycle, the system returns to its identical initial state, so Delta psi = psi_final - psi_initial = 0.",
        distractor_rationales: {
          "0": "Cyclic integral of state functions is zero for both reversible AND irreversible cycles.",
          "2": "Net work equals net heat by First Law, but this does not explain why properties themselves return to initial values.",
          "3": "Entropy generation is positive for irreversible cycles; onlyoint (dQ/T) <= 0 by Clausius."
        }
      }
    ]
  },
  "Operating Systems": {
    title: "Operating Systems Sub-Concept Diagnostic Assessment",
    topic: "Operating Systems",
    questions: [
      {
        micro_concept: "Virtual Address Translation & TLB",
        difficulty: "Conceptual",
        question_text: "In a paging system with a Translation Lookaside Buffer (TLB), why is a TLB miss costly to system performance?",
        options: [
          "The CPU must immediately trigger a hardware reboot of the memory controller",
          "The MMU must perform multiple memory accesses to traverse the hierarchical page table in main memory",
          "The operating system must swap the dirty page out to the disk subsystem",
          "The process must be killed and restarted in kernel mode"
        ],
        correct_option_index: 1,
        explanation: "When a TLB miss occurs, the MMU must walk the page table tree stored in main RAM (e.g., 4 levels on x86-64), taking multiple memory bus cycles before the physical address can be resolved.",
        distractor_rationales: {
          "0": "A TLB miss is a normal hardware translation step, not a hardware fault requiring a reboot.",
          "2": "Confuses a TLB miss (address translation lookup) with a page fault (page not present in RAM).",
          "3": "TLB misses do not kill processes; they simply induce memory lookup latency."
        }
      },
      {
        micro_concept: "Race Conditions & Atomic Operations",
        difficulty: "Basic",
        question_text: "Which of the following conditions characterizes a software race condition?",
        options: [
          "Two threads read from the same memory address concurrently without locks",
          "Multiple threads concurrently access and mutate shared data, and the final state depends on execution interleaving",
          "A thread holds a lock for longer than its allocated CPU time quantum",
          "The operating system scheduler assigns equal priority to multiple background threads"
        ],
        correct_option_index: 1,
        explanation: "A race condition occurs when two or more threads concurrently access shared memory, at least one access is a write, and the outcome depends on nondeterministic thread scheduling order.",
        distractor_rationales: {
          "0": "Concurrent reads are safe and do not constitute a race condition (readers-writers problem).",
          "2": "Holding a lock too long causes latency or priority inversion, not a race condition.",
          "3": "Equal priority scheduling is a normal scheduler configuration."
        }
      },
      {
        micro_concept: "Coffman Conditions & Deadlock",
        difficulty: "Application",
        question_text: "System has 3 processes (P1, P2, P3) and 3 single-unit resources (R1, R2, R3). P1 holds R1 and requests R2; P2 holds R2 and requests R3; P3 holds R3 and requests R1. Which Coffman condition can be broken by preemption to resolve this deadlock?",
        options: [
          "Mutual Exclusion",
          "Hold and Wait",
          "No Preemption",
          "Circular Wait"
        ],
        correct_option_index: 2,
        explanation: "The 'No Preemption' condition states resources cannot be forcibly seized from a holding process. By forcibly revoking R2 from P2 or R3 from P3 (preemption), the operating system breaks the cycle.",
        distractor_rationales: {
          "0": "Mutual exclusion cannot easily be broken if resources are fundamentally non-shareable.",
          "1": "Hold and wait can be prevented beforehand, but dynamically revoking a currently held resource is preemption.",
          "3": "Circular wait is the symptom graph structure; preemption is the operational mechanism used here."
        }
      },
      {
        micro_concept: "Banker's Algorithm & Safe States",
        difficulty: "Application",
        question_text: "In Dijkstra's Banker's Algorithm, what does a state being defined as 'safe' guarantee?",
        options: [
          "No process will ever experience a page fault during memory execution",
          "There exists at least one sequence of process completions such that all processes can satisfy their maximum claim without deadlock",
          "All resources are currently idle and immediately allocated to highest priority processes",
          "Deadlock has already occurred and is actively being recovered by the kernel"
        ],
        correct_option_index: 1,
        explanation: "A safe state is one where there exists a safe execution sequence <P1, P2, ..., Pn> where each process Pi can satisfy its maximum remaining resource demands using currently available resources plus resources freed by preceding processes.",
        distractor_rationales: {
          "0": "Banker's algorithm manages resource allocation safety, not memory page faults.",
          "2": "Resources do not need to be idle; they can be heavily utilized while still in a safe state.",
          "3": "An unsafe state might lead to deadlock, but a safe state guarantees deadlock cannot occur."
        }
      },
      {
        micro_concept: "Virtual Address Translation & TLB",
        difficulty: "Conceptual",
        question_text: "What occurs during a hardware Page Fault exception on modern operating systems?",
        options: [
          "The CPU hardware terminates the program immediately due to illegal access violation",
          "The MMU traps to OS kernel mode, the OS reads the required page from swap disk into a free RAM frame, updates the page table present bit, and resumes execution",
          "The CPU reloads the TLB with randomized address indices to clear cache corruption",
          "The operating system disables virtual memory and runs in physical mode"
        ],
        correct_option_index: 1,
        explanation: "When a page table entry has its present bit cleared, referencing it triggers a hardware page fault. The OS fault handler fetches the page from backing store, puts it into a free physical frame, updates PTE valid/present bit, and restarts the faulting instruction.",
        distractor_rationales: {
          "0": "A legitimate page fault is a routine virtual memory mechanism, not an unrecoverable segmentation fault.",
          "2": "Page faults do not randomize TLB entries.",
          "3": "Virtual memory remains active; page faults are the core mechanism that makes virtual memory function."
        }
      }
    ]
  },
  "Data Structures & Algorithms": {
    title: "Data Structures & Algorithms Diagnostic Assessment",
    topic: "Data Structures & Algorithms",
    questions: [
      {
        micro_concept: "Optimal Substructure & Overlapping Subproblems",
        difficulty: "Conceptual",
        question_text: "What is the defining requirement for a problem to be solved using Dynamic Programming rather than Divide and Conquer?",
        options: [
          "Subproblems must be completely independent and never share common sub-computations",
          "The problem must exhibit overlapping subproblems, meaning recursive calls recompute identical states repeatedly",
          "The graph must contain negative weight cycles to allow edge relaxation",
          "The time complexity must strictly be linear O(N) in all cases"
        ],
        correct_option_index: 1,
        explanation: "Dynamic programming is applicable when a problem has both optimal substructure and overlapping subproblems. Memoization or tabulation saves solutions to overlapping states to eliminate exponential redundant work.",
        distractor_rationales: {
          "0": "Independent subproblems are the hallmark of standard Divide and Conquer (e.g. Merge Sort).",
          "2": "Negative weight cycles relate to graph shortest paths, not the fundamental definition of DP.",
          "3": "DP time complexity depends on the state space and transitions, and is frequently polynomial (O(N^2), O(N*W)), not necessarily O(N)."
        }
      },
      {
        micro_concept: "Dijkstra Relaxation Invariant",
        difficulty: "Application",
        question_text: "Why does standard Dijkstra's algorithm fail to guarantee correct shortest paths when a graph contains negative edge weights?",
        options: [
          "Because min-heaps cannot store negative numerical values in memory",
          "Because once a vertex is extracted from the priority queue, Dijkstra assumes its shortest path is permanently finalized and never relaxes it again",
          "Because negative edges cause the graph to become non-directional",
          "Because priority queues require integer weights rather than floating-point decimals"
        ],
        correct_option_index: 1,
        explanation: "Dijkstra's greedy choice property relies on edge weights being non-negative so that path lengths are monotonically increasing. With negative edges, an already-visited vertex could later reach an even shorter path through a negative weight edge.",
        distractor_rationales: {
          "0": "Priority queues and min-heaps handle negative numbers without any issue.",
          "2": "Edge signs do not affect edge directionality.",
          "3": "Dijkstra works with floating-point non-negative weights; negative weight is the failure point."
        }
      },
      {
        micro_concept: "AVL Balance Factor",
        difficulty: "Basic",
        question_text: "In an AVL tree, what is the valid allowable range for the balance factor (Height(Left) - Height(Right)) of any node?",
        options: [
          "Strictly 0",
          "-1, 0, or +1",
          "-2 to +2",
          "Any positive integer"
        ],
        correct_option_index: 1,
        explanation: "An AVL tree is strictly height-balanced: for every node, the heights of its left and right subtrees can differ by at most 1, meaning the balance factor must belong to {-1, 0, 1}.",
        distractor_rationales: {
          "0": "Only a perfectly balanced tree has balance factor 0 at all nodes, which is overly restrictive.",
          "2": "A balance factor of +2 or -2 indicates an unbalance that triggers immediate single or double rotation.",
          "3": "Unbounded balance factors allow degenerate O(N) linked-list trees."
        }
      },
      {
        micro_concept: "Optimal Substructure & Overlapping Subproblems",
        difficulty: "Application",
        question_text: "In the 0/1 Knapsack problem with N items and maximum capacity W, what are the state dimensions for the standard DP table?",
        options: [
          "1D array of size N",
          "2D table of dimensions (N + 1) x (W + 1)",
          "3D tensor of (N) x (W) x (Value)",
          "Binary search tree of height log(N)"
        ],
        correct_option_index: 1,
        explanation: "The state is parameterized by the item index i (from 0 to N) and the remaining knapsack weight limit w (from 0 to W), yielding a 2D table dp[i][w] representing max value achievable using a subset of first i items with capacity w.",
        distractor_rationales: {
          "0": "A 1D array of size N loses track of capacity constraints unless using space-optimized reverse 1D iteration.",
          "2": "Value is the dependent variable computed in the cell, not an input dimension of the table.",
          "3": "0/1 Knapsack state space is fundamentally tabular DP."
        }
      },
      {
        micro_concept: "Dijkstra Relaxation Invariant",
        difficulty: "Conceptual",
        question_text: "What is the optimal time complexity of Dijkstra's algorithm implemented with a binary min-heap for a graph with V vertices and E edges?",
        options: [
          "O(V^3)",
          "O(E * log(V))",
          "O(V + E)",
          "O(2^V)"
        ],
        correct_option_index: 1,
        explanation: "Extracting min vertex takes O(log V) per vertex (total O(V log V)). Each edge relaxation inserts or decreases-key in the min-heap taking O(log V) (total O(E log V)). Since E >= V in connected graphs, overall complexity is O(E log V).",
        distractor_rationales: {
          "0": "O(V^3) is Floyd-Warshall all-pairs shortest path, not Dijkstra.",
          "2": "O(V + E) is unweighted BFS shortest path; priority queue operations add the log(V) factor.",
          "3": "O(2^V) is brute force enumeration."
        }
      }
    ]
  }
};

// Seed Remediation Modules for Critical Deficits (accuracy <= 50%)
export const SEED_REMEDIATION = {
  "State Functions vs Path Functions": {
    micro_concept: "State Functions vs Path Functions",
    topic: "Thermodynamics",
    tier_1_foundation: {
      mental_model: "Imagine climbing a mountain: your elevation depends purely on your geographical coordinates (state function), regardless of whether you took a gentle winding switchback or a sheer vertical cliff face. However, the calories burned and sweat produced depend entirely on the path taken (path functions: heat and work).",
      core_formula: "oint d(State Function) = 0, whereas Delta U = Q - W where dU is exact, delta Q and delta W are inexact differentials",
      timestamp_hint: "Look for the lecture slide contrasting exact differentials (dU, dH) with inexact boundary transfers (delta Q, delta W) at 04:15."
    },
    tier_2_discrimination: {
      misconception: "Believing that heat and work are properties contained inside a thermodynamic substance.",
      corrective_rule: "Matter contains internal energy (U), enthalpy (H), and entropy (S). Heat (Q) and work (W) exist only in transit across system boundaries during a process.",
      contrast_table: [
        {
          faulty_belief: "A hot gas has 'a lot of heat' stored inside it.",
          scientific_reality: "A gas stores internal kinetic and potential energy (U). Heat is solely energy in transit driven by temperature differential."
        },
        {
          faulty_belief: "Work done can be determined knowing solely initial and final pressure/volume.",
          scientific_reality: "Work equals integral of P dV; without knowing the continuous pressure path P(V), work cannot be calculated."
        },
        {
          faulty_belief: "Cyclic integral of heat transfer equals zero over any complete cycle.",
          scientific_reality: "Cyclic integral of heat equals cyclic work (oint dQ = oint dW = W_net). It is generally non-zero."
        }
      ]
    },
    tier_3_drills: [
      {
        question_text: "A system undergoes an adiabatic process from state A to state B. Does the work done depend on the path taken between A and B?",
        options: [
          "Yes, work is always path-dependent regardless of adiabatic conditions",
          "No, for an adiabatic process Q = 0, so W = -Delta U, which depends strictly on state coordinates",
          "Yes, because entropy changes uncontrollably without heat exchange",
          "Work is zero for any adiabatic process"
        ],
        correct_option_index: 1,
        explanation: "By First Law, Delta U = Q - W. When Q = 0 (adiabatic), W = -Delta U. Because U is a state function, Delta U depends solely on endpoints A and B, making adiabatic work identical for all paths connecting those states."
      },
      {
        question_text: "Which differential notation correctly reflects the mathematical nature of thermodynamic work and internal energy?",
        options: [
          "dW is exact, dU is inexact",
          "dU is exact (d U), delta W is inexact (delta W)",
          "Both dU and dW are exact differentials",
          "Both dU and dW are inexact differentials"
        ],
        correct_option_index: 1,
        explanation: "State functions have exact differentials (written dU), meaning their line integral is path-independent. Path functions have inexact differentials (written delta W or d-bar W)."
      }
    ]
  },
  "Carnot Thermal Efficiency": {
    micro_concept: "Carnot Thermal Efficiency",
    topic: "Thermodynamics",
    tier_1_foundation: {
      mental_model: "A waterwheel cannot extract energy from falling water without allowing the water to discharge at the lower stream. Similarly, a heat engine cannot turn heat into work without rejecting waste heat to a colder sink. The maximum possible fraction of heat converted to work is dictated solely by the absolute temperature ratio.",
      core_formula: "eta_Carnot = 1 - (T_C / T_H), where temperatures MUST be in Kelvin (absolute scale)",
      timestamp_hint: "Jump to 11:20 where the instructor derives why no cycle operating between two temperatures can surpass 1 - T_C/T_H."
    },
    tier_2_discrimination: {
      misconception: "Assuming that advancing technology or better engine lubricants can push thermal engine efficiency to 90%+ between ordinary ambient temperatures.",
      corrective_rule: "The Carnot limit is a fundamental physical barrier imposed by the Second Law of Thermodynamics, not a mechanical engineering or friction limitation.",
      contrast_table: [
        {
          faulty_belief: "Using Celsius in eta = 1 - T_C/T_H produces valid efficiency ratios.",
          scientific_reality: "Using Celsius yields mathematically catastrophic errors; thermodynamic temperature T is strictly in Kelvin."
        },
        {
          faulty_belief: "A 100% frictionless engine can convert 100% of heat into mechanical work.",
          scientific_reality: "Kelvin-Planck statement: It is impossible for any cycle to produce work while exchanging heat with only a single reservoir."
        }
      ]
    },
    tier_3_drills: [
      {
        question_text: "A geothermal plant operates between hot brine at 127 deg C (400 K) and cooling air at 27 deg C (300 K). What is its maximum theoretical efficiency?",
        options: [
          "78.7% (using 1 - 27/127)",
          "25.0% (using 1 - 300/400)",
          "50.0%",
          "100.0%"
        ],
        correct_option_index: 1,
        explanation: "Converting to Kelvin: T_H = 127 + 273.15 = 400 K; T_C = 27 + 273.15 = 300 K. Maximum Carnot efficiency = 1 - (300 / 400) = 0.25 or 25%."
      },
      {
        question_text: "To maximize the thermal efficiency of a Carnot heat engine, which strategy yields the greatest theoretical gain?",
        options: [
          "Increasing cold reservoir temperature T_C",
          "Increasing hot reservoir temperature T_H while keeping T_C as low as possible",
          "Increasing the mass of the working fluid by 2x",
          "Switching from helium to ideal air without changing temperatures"
        ],
        correct_option_index: 1,
        explanation: "Since eta = 1 - T_C/T_H, maximizing T_H and minimizing T_C drives the ratio T_C/T_H toward zero, maximizing thermodynamic efficiency."
      }
    ]
  },
  "Virtual Address Translation & TLB": {
    micro_concept: "Virtual Address Translation & TLB",
    topic: "Operating Systems",
    tier_1_foundation: {
      mental_model: "Think of virtual addresses as library call numbers and physical addresses as the exact shelf and floor. The TLB is the librarian's quick-reference index card on her desk. If the card is there (TLB hit), you get the shelf location in 1 second. If not (TLB miss), she must walk into the archive room and consult a 4-volume catalog (multi-level page table) before finding your book.",
      core_formula: "Effective Access Time (EAT) = (Hit_Rate * T_TLB) + ((1 - Hit_Rate) * (T_TLB + N_levels * T_RAM))",
      timestamp_hint: "Review 08:35 where the multi-level page table walk is diagrammed step-by-step."
    },
    tier_2_discrimination: {
      misconception: "Conflating a TLB miss with a Page Fault.",
      corrective_rule: "A TLB miss means the translation is in RAM page tables but not cached in CPU TLB. A page fault means the page is not in RAM at all and must be fetched from disk.",
      contrast_table: [
        {
          faulty_belief: "A TLB miss requires a disk read to resolve.",
          scientific_reality: "A TLB miss only accesses physical RAM to read page table entries. Disk is never touched during a pure TLB miss."
        },
        {
          faulty_belief: "Page tables reside inside the CPU chip.",
          scientific_reality: "Only the TLB cache is on the CPU die. The multi-level page tables reside in main memory (DRAM)."
        }
      ]
    },
    tier_3_drills: [
      {
        question_text: "If TLB access time is 2 ns and main memory access time is 100 ns on a 4-level page table architecture, what is the memory lookup latency on a TLB miss?",
        options: [
          "102 ns",
          "402 ns (2 ns TLB check + 4 * 100 ns page table walk)",
          "1000 ns",
          "2 ns"
        ],
        correct_option_index: 1,
        explanation: "On a miss, the system takes 2 ns to check the TLB, plus 4 consecutive RAM accesses (4 * 100 ns = 400 ns) to walk the 4 page table levels, totaling 402 ns."
      },
      {
        question_text: "What hardware component is responsible for caching virtual-to-physical address translations directly on the processor?",
        options: [
          "Direct Memory Access (DMA) controller",
          "Translation Lookaside Buffer (TLB)",
          "Southbridge bus controller",
          "Swap file partition"
        ],
        correct_option_index: 1,
        explanation: "The TLB is a high-speed associative hardware cache integrated into the Memory Management Unit (MMU) inside the CPU core."
      }
    ]
  },
  "Optimal Substructure & Overlapping Subproblems": {
    micro_concept: "Optimal Substructure & Overlapping Subproblems",
    topic: "Data Structures & Algorithms",
    tier_1_foundation: {
      mental_model: "If finding the shortest route from New York to Los Angeles via Chicago includes the shortest route from Chicago to LA, the problem has optimal substructure. If computing multiple routes requires solving the Chicago-to-LA segment repeatedly, it has overlapping subproblems. Dynamic Programming solves it once and writes it down in a table.",
      core_formula: "DP State: dp[state] = min/max (dp[previous_state] + transition_cost)",
      timestamp_hint: "Examine 14:20 illustrating the Directed Acyclic Graph (DAG) of subproblem states."
    },
    tier_2_discrimination: {
      misconception: "Thinking that memoization and tabulation have different computational time complexity.",
      corrective_rule: "Top-down memoization and bottom-up tabulation explore the same subproblem graph and share the same asymptotic Big-O time complexity; they differ only in recursion call overhead and space locality.",
      contrast_table: [
        {
          faulty_belief: "Divide and Conquer is the same as Dynamic Programming.",
          scientific_reality: "Divide and Conquer solves non-overlapping subproblems (e.g. distinct halves in Merge Sort). DP eliminates repeated work on overlapping subproblems."
        },
        {
          faulty_belief: "Greedy algorithms always work if a problem has optimal substructure.",
          scientific_reality: "Greedy requires the greedy-choice property (locally optimal choices lead to global optimum), whereas DP checks all valid subproblem combinations."
        }
      ]
    },
    tier_3_drills: [
      {
        question_text: "Why does the standard recursive Fibonacci algorithm take O(2^N) time, whereas DP memoization reduces it to O(N)?",
        options: [
          "Memoization converts integers to 64-bit floats",
          "Memoization caches previously computed Fibonacci values so each subproblem is evaluated exactly once",
          "Memoization runs recursive calls in parallel threads",
          "Memoization eliminates the base cases F(0) and F(1)"
        ],
        correct_option_index: 1,
        explanation: "Without memoization, the recursive tree branches into 2^N calls computing identical states (like Fib(3)) countless times. Memoization checks the cache in O(1), ensuring only N distinct states are computed."
      },
      {
        question_text: "Which of the following problems does NOT exhibit optimal substructure?",
        options: [
          "Shortest Path in an unweighted graph",
          "Longest Simple Path in a general graph",
          "0/1 Knapsack Problem",
          "Matrix Chain Multiplication"
        ],
        correct_option_index: 1,
        explanation: "Longest Simple Path in a general graph is NP-hard because subproblems share vertices and are not independent, failing the optimal substructure requirement."
      }
    ]
  }
};
