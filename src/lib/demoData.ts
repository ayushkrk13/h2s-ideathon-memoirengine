// Demo data for the fictional Sharma family archive
// Used in DEMO MODE when APIs are unavailable

export interface Memory {
  id: string;
  title: string;
  year: number;
  location: string;
  people: string[];
  objects: string[];
  emotions: string[];
  transcript: string;
  prose: string;
  imageUrl?: string;
  audioUrl?: string;
  chapter: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  type: 'childhood' | 'education' | 'career' | 'family' | 'migration' | 'milestone';
  memoryId?: string;
  significance: 'normal' | 'major' | 'defining';
}

export interface FamilyMember {
  id: string;
  name: string;
  birth: number;
  death?: number;
  relationship: string;
  connections: string[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  yearStart: number;
  yearEnd: number;
  location: string;
  memoriesIds: string[];
  prose: string;
}

export const DEMO_SUBJECT = {
  name: 'Ramesh Sharma',
  born: 1942,
  birthplace: 'Varanasi, Uttar Pradesh',
  currentLocation: 'Mumbai',
  tagline: 'Schoolteacher, father, keeper of stories.',
};

export const DEMO_MEMORIES: Memory[] = [
  {
    id: 'mem-001',
    title: 'The First Radio',
    year: 1952,
    location: 'Varanasi',
    people: ['Father', 'Mother', 'Younger sister Leela'],
    objects: ['Murphy Radio', 'Brass lamp', 'Charpoy'],
    emotions: ['wonder', 'joy', 'belonging'],
    transcript: `It was a Murphy radio. My father brought it home on a Tuesday — I remember because the school was closed that day for some local festival. It was wrapped in cloth, not a box, just cloth. He set it on the wooden shelf where my mother kept her brass pots, and when the sound came out — voices, actual voices from somewhere far away — my younger sister Leela grabbed my hand. We had never heard anything like it. My mother said it was magic. My father said it was science. I think it was both.`,
    prose: `The Murphy radio arrived on a Tuesday in 1952, wrapped in rough cotton cloth rather than a proper box — a small economy that said everything about those years. Ramesh was ten years old when his father carried it through the narrow lane of their Varanasi home and placed it ceremoniously on the shelf that had until that moment held his mother's brass pots.\n\nWhen the voices came through — clear, impossible voices from cities he had never seen — his younger sister Leela reached for his hand without thinking. They stood together in the amber light of the brass lamp, two children hearing the world for the first time.\n\n"Your mother called it magic," he would say decades later, smiling at the memory. "Your father called it science." He would pause. "I think it was both."`,
    chapter: 'roots',
    tags: ['childhood', 'family', 'technology', 'wonder'],
  },
  {
    id: 'mem-002',
    title: 'The Mango Tree School',
    year: 1955,
    location: 'Varanasi',
    people: ['Masterji Tripathi', 'Friends'],
    objects: ['Slate', 'Chalk', 'Mango tree'],
    emotions: ['discipline', 'curiosity', 'friendship'],
    transcript: `The school had no walls on two sides. Just a mango tree and the open field. Masterji Tripathi would teach us arithmetic by counting the mangoes that fell. In summer, the class smelled of raw mango. He was strict but fair. He once gave me full marks on an essay and wrote in the margin — "Ramesh has the heart of a writer." I kept that slate for years.`,
    prose: `The municipal school in Varanasi's Sigra neighbourhood had no walls on its eastern side, and on summer days the classroom smelled of raw mango from the enormous tree that had grown there longer than anyone could remember. Masterji Tripathi taught arithmetic by counting fallen fruit, and literature by reading aloud from books so old the covers had worn away entirely.\n\nOn the day he returned Ramesh's essay — on the topic of "What I Would Tell the River" — he had written in the margin in his precise Devanagari hand: *Ramesh has the heart of a writer.* The slate was kept for years, long past the time when it had any practical use.`,
    chapter: 'roots',
    tags: ['education', 'childhood', 'teachers', 'writing'],
  },
  {
    id: 'mem-003',
    title: 'The Floods of 1960',
    year: 1960,
    location: 'Varanasi',
    people: ['Father', 'Neighbours', 'Pandit Girish'],
    objects: ['Boat', 'Tin trunk', 'Documents'],
    emotions: ['fear', 'resilience', 'community'],
    transcript: `The Ganga rose that year like I had never seen. Our entire lane was underwater by the third day. My father stood waist-deep moving our tin trunk — the one with all the important documents, my mother's jewellery — to the second floor. Pandit Girish from next door had a small wooden boat and he was taking children to higher ground. I helped him row. I was eighteen. I felt for the first time that I was not a boy.`,
    prose: `The monsoon of 1960 was the worst Varanasi had seen in forty years. When the Ganga breached its ghats on the third day, the lane where the Sharma family had lived for two generations disappeared beneath brown, purposeful water.\n\nRamesh's father moved the tin trunk — the one that held land documents, his wife's gold, and a photograph of his own father — to the second floor with the methodical calm of a man who has prepared for catastrophe his entire life. Eighteen-year-old Ramesh spent that afternoon rowing Pandit Girish's wooden boat through the submerged alley, ferrying neighbours' children to higher ground.\n\n"That was when I stopped being a boy," he says simply. The river, he has always believed, taught him the most important thing: that water rises and water falls, and a man's worth is measured only in what he does in between.`,
    chapter: 'roots',
    tags: ['floods', 'resilience', 'family', 'coming-of-age'],
  },
  {
    id: 'mem-004',
    title: 'Leaving for Allahabad',
    year: 1963,
    location: 'Allahabad',
    people: ['Father', 'University friends', 'Professor Mehra'],
    objects: ['Suitcase', 'Train ticket', 'Books'],
    emotions: ['excitement', 'anxiety', 'independence'],
    transcript: `I had one suitcase and sixty rupees. My father came to the station but didn't say much. He checked that I had my admission letter. He checked that I had water. When the train moved, I looked back and he was still standing there, very still, with his hands behind his back — the way he always stood when he was trying not to show something. I didn't cry until Mughal Sarai.`,
    prose: `On the morning Ramesh Sharma left Varanasi for Allahabad University, he carried a single suitcase, sixty rupees folded into the inner pocket of his shirt, and an admission letter he had read so many times the paper had softened at the folds.\n\nHis father came to the station. He checked the admission letter. He checked that his son had a water bottle. He said very little, which was his way of saying a great deal.\n\nAs the train pulled away from Varanasi Junction, Ramesh pressed his face to the iron bars of the open window. His father stood on the platform, hands clasped behind his back — the private posture he adopted when suppressing feeling. He grew smaller and then disappeared into the crowd.\n\nRamesh did not cry until Mughal Sarai station, seventy kilometres down the line, when the city of his entire life was truly gone.`,
    chapter: 'journey',
    tags: ['university', 'separation', 'family', 'new beginnings'],
  },
  {
    id: 'mem-005',
    title: 'Meeting Savitri',
    year: 1968,
    location: 'Allahabad',
    people: ['Savitri (wife)', 'Her father'],
    objects: ['Tea cup', 'Library book'],
    emotions: ['surprise', 'recognition', 'love'],
    transcript: `She was returning a book to the library that I wanted to borrow. The same book. I asked if she had finished it. She said yes. I asked what she thought. She told me, very precisely, everything that was wrong with the ending. I agreed with all of it. I think I knew then. Her father was very traditional but Savitri had made up her mind, so it really didn't matter.`,
    prose: `The library at Allahabad University was open on Saturday mornings, and on one such morning in the winter of 1968, Ramesh Sharma was waiting for a copy of *The Discovery of India* to be returned when a young woman placed exactly that book on the desk.\n\nHe asked whether she had finished it. She had. He asked what she thought. Savitri Pandey told him, with a precision that he found immediately arresting, everything that was structurally wrong with the final chapters.\n\nHe agreed with all of it.\n\nThey spoke for an hour and fifteen minutes in the corridor outside the library, until a peon began sweeping pointedly around their feet. Her father, a conservative gentleman from Lucknow, had strong opinions about the kind of man his daughter should marry. Savitri had stronger opinions about the man she would marry herself.\n\nRamesh has often said that the argument was essentially settled in that library corridor, though neither of them knew it yet.`,
    chapter: 'journey',
    tags: ['love', 'marriage', 'university', 'Savitri'],
  },
  {
    id: 'mem-006',
    title: 'The First Teaching Post',
    year: 1972,
    location: 'Lucknow',
    people: ['Principal Saxena', 'Students'],
    objects: ['Chalk', 'Register', 'Bicycle'],
    emotions: ['purpose', 'nervousness', 'pride'],
    transcript: `My first class was Class VII, Section B. Forty-three students. I had prepared so thoroughly that my notes ran to eleven pages. I used exactly one and a half. Principal Saxena told me afterward — you prepare for ten years but you teach from the moment. That is the whole secret. I've said the same thing to every new teacher I have ever trained.`,
    prose: `Ramesh Sharma's first classroom was on the second floor of Government Boys' Higher Secondary School in Lucknow, and it contained forty-three twelve-year-old boys who had, the previous term, reduced their History teacher to tears.\n\nHe had prepared eleven pages of notes. He used one and a half.\n\nPrincipal Saxena, a small man with a large reputation, found him in the staff room that evening. "You prepare for ten years," he said, without preamble, "but you teach from the moment. That is the whole secret." He then left without further comment.\n\nRamesh has repeated those two sentences to every new teacher he has ever trained. Forty-one years later, he still cannot improve upon them.`,
    chapter: 'career',
    tags: ['teaching', 'career', 'education', 'purpose'],
  },
  {
    id: 'mem-007',
    title: 'The Birth of Priya',
    year: 1975,
    location: 'Lucknow',
    people: ['Savitri', 'Priya (daughter)', 'Dr. Sharma'],
    objects: ['Hospital bracelet', 'Marigolds'],
    emotions: ['awe', 'terror', 'love', 'transformation'],
    transcript: `I held her for the first time and I didn't know what to do with my hands. I was a grown man, I had taught hundreds of children, and I didn't know what to do with my hands. Savitri was exhausted but she laughed at me. She said — you're holding a person, not a vase. I said — she's smaller than a vase. She's so small.`,
    prose: `On the afternoon of 14th March 1975, Ramesh Sharma became a father. He was thirty-three years old, had taught over four hundred children, had navigated floods and departures and the politics of staffrooms. He had no idea what to do with his hands.\n\nPriya Sharma weighed three kilograms and four hundred grams and was, in her father's later estimation, "smaller than I thought a person could be." A nurse placed her in his arms with the practised efficiency of someone who has performed this handover many thousands of times, and Ramesh stood rigid, afraid to move.\n\nSavitri, exhausted and stitched and triumphant in the hospital bed, observed her husband's paralysis and began to laugh. "You are holding a person," she said, "not a vase."\n\n"She is smaller than a vase," he said. He was completely serious.`,
    chapter: 'family',
    tags: ['fatherhood', 'Priya', 'birth', 'love'],
  },
  {
    id: 'mem-008',
    title: 'Moving to Mumbai',
    year: 1983,
    location: 'Mumbai',
    people: ['Savitri', 'Priya', 'Brother Suresh'],
    objects: ['Truck', 'Old furniture', 'Varanasi soil (jar)'],
    emotions: ['nostalgia', 'hope', 'grief', 'renewal'],
    transcript: `My brother Suresh had found work there and said there was opportunity. We arrived with everything we owned in a hired truck. The smell was different. The noise was different. Everything moved faster. I brought a small jar of soil from our Varanasi garden — I still have it. Priya was eight and thought Mumbai was a different country. She was not entirely wrong.`,
    prose: `The truck that carried the Sharma family's possessions from Lucknow to Mumbai in June of 1983 took two days and broke down once near Nashik. Everything they owned — the furniture from three different cities, Ramesh's books in their careful numbering system, Savitri's brass pots that had survived the Varanasi floods of 1960 — arrived dusty but intact.\n\nRamesh had packed one additional item himself, in a small glass jar with a metal lid: a handful of soil from the garden of the Varanasi house where he had grown up, already sold to a property developer who would build something new over it.\n\nEight-year-old Priya pressed her face to the truck window as they entered the city and declared that Mumbai smelled "like another country." Her father did not correct her. It did.`,
    chapter: 'migration',
    tags: ['Mumbai', 'migration', 'family', 'roots'],
  },
  {
    id: 'mem-009',
    title: 'Priya\'s First Daughter',
    year: 2000,
    location: 'Mumbai',
    people: ['Priya', 'Vikram (son-in-law)', 'Ananya (granddaughter)', 'Savitri'],
    objects: ['Hospital', 'Marigold garland'],
    emotions: ['continuation', 'wonder', 'gratitude', 'fullness'],
    transcript: `When Savitri and I went to see Ananya for the first time — she was one day old — I thought about my father on the Varanasi platform, not speaking. I understood then why he couldn't speak. There are moments that are too full for words. You just stand there, with your hands behind your back, trying not to show anything.`,
    prose: `Ananya was born in the early morning of 7th April 2000, the first grandchild. When Ramesh and Savitri arrived at the hospital that afternoon, Priya placed the infant in her father's arms with the same gesture with which a nurse had placed Priya in those same arms twenty-five years before.\n\nRamesh held his granddaughter and thought, for the first time since Varanasi Junction in 1963, about his own father standing on the platform with his hands behind his back, trying not to show something.\n\nHe understood it now. There are moments that accumulate all the other moments inside them, that contain too much to speak about. You simply stand there, present in the fullness of it, and you let the silence say what you cannot.\n\nHe stood there for a long time.`,
    chapter: 'legacy',
    tags: ['grandchildren', 'Ananya', 'continuation', 'family'],
  },
  {
    id: 'mem-010',
    title: 'Savitri\'s Last Summer',
    year: 2018,
    location: 'Mumbai',
    people: ['Savitri', 'Priya', 'Ananya'],
    objects: ['Garden', 'Her reading chair', 'Photograph albums'],
    emotions: ['love', 'grief', 'presence', 'memory'],
    transcript: `That last summer she wanted to look at all the photographs. Every album. She kept saying — look at this one, look at that one. Not sad. Just thorough. Like she was making sure we had all of them. That we had seen them. That last evening she sat in her chair in the garden and just watched the light change on the wall. I sat next to her. We didn't need to talk.`,
    prose: `In the summer of 2018, Savitri Sharma asked to look at the photograph albums. All of them. Every box from the top shelf of the bedroom cupboard was brought down, and over three evenings she and Ramesh sat at the dining table and moved through fifty years of accumulated images with careful attention.\n\nShe was not melancholy. She was thorough. As if conducting an inventory. As if ensuring that nothing had been missed.\n\nOn the final evening of that exercise, she sat in her garden chair and watched the late light move across the courtyard wall — the particular amber light of Mumbai in June, which she had always found beautiful. Ramesh sat beside her. There was nothing to say that they had not already said across fifty years of daily life, and so they said nothing.\n\nThe light changed. She watched it change.\n\nThat was enough.`,
    chapter: 'legacy',
    tags: ['Savitri', 'grief', 'love', 'presence', 'photographs'],
  },
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  { id: 'tl-1942', year: 1942, title: 'Born in Varanasi', description: 'Born to schoolteacher father and homemaker mother in the old city lanes of Varanasi.', type: 'childhood', significance: 'defining' },
  { id: 'tl-1952', year: 1952, title: 'The Murphy Radio', description: 'Father brings home a Murphy Radio — first encounter with a world beyond Varanasi.', type: 'childhood', memoryId: 'mem-001', significance: 'major' },
  { id: 'tl-1955', year: 1955, title: 'The Mango Tree School', description: 'Masterji Tripathi writes "Ramesh has the heart of a writer" on a returned essay.', type: 'education', memoryId: 'mem-002', significance: 'major' },
  { id: 'tl-1960', year: 1960, title: 'The Great Floods', description: 'The Ganga rises. Rows Pandit Girish\'s boat through the flooded lanes.', type: 'milestone', memoryId: 'mem-003', significance: 'defining' },
  { id: 'tl-1963', year: 1963, title: 'Allahabad University', description: 'Leaves Varanasi with one suitcase and sixty rupees.', type: 'education', memoryId: 'mem-004', significance: 'major' },
  { id: 'tl-1968', year: 1968, title: 'Meets Savitri', description: 'In the library — they both wanted the same book.', type: 'family', memoryId: 'mem-005', significance: 'defining' },
  { id: 'tl-1970', year: 1970, title: 'Marriage', description: 'Marries Savitri Pandey. Her father, eventually, approves.', type: 'family', significance: 'major' },
  { id: 'tl-1972', year: 1972, title: 'First Teaching Post', description: 'Class VII Section B. Forty-three students. Eleven pages of notes used one and a half.', type: 'career', memoryId: 'mem-006', significance: 'major' },
  { id: 'tl-1975', year: 1975, title: 'Priya is Born', description: '"She is smaller than a vase."', type: 'family', memoryId: 'mem-007', significance: 'defining' },
  { id: 'tl-1978', year: 1978, title: 'Promoted to Head of Department', description: 'Youngest Head of the History Department in the school\'s history.', type: 'career', significance: 'normal' },
  { id: 'tl-1983', year: 1983, title: 'Moving to Mumbai', description: 'A truck, two days, one breakdown near Nashik, and a jar of Varanasi soil.', type: 'migration', memoryId: 'mem-008', significance: 'defining' },
  { id: 'tl-1990', year: 1990, title: 'Principal', description: 'Becomes Principal of St. Xavier\'s Vidyamandir, Mumbai.', type: 'career', significance: 'major' },
  { id: 'tl-1995', year: 1995, title: 'Priya\'s Marriage', description: 'Priya marries Vikram. Ramesh delivers a speech that makes the whole hall cry.', type: 'family', significance: 'major' },
  { id: 'tl-2000', year: 2000, title: 'Ananya is Born', description: 'First grandchild. Stands at the hospital, hands behind his back, unable to speak.', type: 'family', memoryId: 'mem-009', significance: 'defining' },
  { id: 'tl-2007', year: 2007, title: 'Retirement', description: 'Retires after 35 years in education. Over 2,000 students.', type: 'career', significance: 'major' },
  { id: 'tl-2018', year: 2018, title: 'Savitri\'s Last Summer', description: 'Looking at all the photographs together. The light changing on the wall.', type: 'family', memoryId: 'mem-010', significance: 'defining' },
  { id: 'tl-2024', year: 2024, title: 'MemoirEngine', description: 'Priya sets up MemoirEngine for her father. The stories begin to be preserved.', type: 'milestone', significance: 'defining' },
];

export const DEMO_FAMILY: FamilyMember[] = [
  { id: 'f-ramesh', name: 'Ramesh Sharma', birth: 1942, relationship: 'Subject', connections: ['f-savitri', 'f-priya', 'f-father', 'f-mother'] },
  { id: 'f-savitri', name: 'Savitri Sharma', birth: 1945, death: 2019, relationship: 'Wife', connections: ['f-ramesh', 'f-priya'] },
  { id: 'f-father', name: 'Shyam Narayan Sharma', birth: 1912, death: 1988, relationship: 'Father', connections: ['f-ramesh', 'f-mother'] },
  { id: 'f-mother', name: 'Kamla Sharma', birth: 1918, death: 1994, relationship: 'Mother', connections: ['f-ramesh', 'f-father'] },
  { id: 'f-priya', name: 'Priya Mehta', birth: 1975, relationship: 'Daughter', connections: ['f-ramesh', 'f-savitri', 'f-vikram', 'f-ananya'] },
  { id: 'f-vikram', name: 'Vikram Mehta', birth: 1972, relationship: 'Son-in-law', connections: ['f-priya'] },
  { id: 'f-ananya', name: 'Ananya Mehta', birth: 2000, relationship: 'Granddaughter', connections: ['f-priya', 'f-vikram', 'f-ramesh'] },
];

export const DEMO_CHAPTERS: Chapter[] = [
  {
    id: 'ch-roots',
    title: 'The Roots',
    subtitle: 'Varanasi, 1942–1962',
    yearStart: 1942,
    yearEnd: 1962,
    location: 'Varanasi, Uttar Pradesh',
    memoriesIds: ['mem-001', 'mem-002', 'mem-003'],
    prose: `There are cities that exist partly outside of time, and Varanasi is one of them. The city where Ramesh Sharma was born in 1942 was not so different from the city that had watched the Ganga rise and fall for three thousand years. The lanes were narrow and loud and alive, the ghats were ancient, and the river was always present — a permanent fact, like gravity or sky.\n\nShyam Narayan Sharma, Ramesh's father, taught mathematics at the municipal school and came home each evening smelling of chalk. He was a quiet man whose emotions could be read only in the precise positions of his body: hands at his sides meant ordinary contentment; hands behind his back meant something was being held, something not to be shown.\n\nThe household was not wealthy by any measure, but it was full — full of people, of argument, of the smell of cooking and the noise of the street, of a mother who sang to herself while she worked and a father who read by lamplight until the oil ran out. When the Murphy Radio arrived in 1952, it did not simply bring sound into that household. It brought the world.`,
  },
  {
    id: 'ch-journey',
    title: 'The Journey',
    subtitle: 'Allahabad & Lucknow, 1963–1975',
    yearStart: 1963,
    yearEnd: 1975,
    location: 'Allahabad & Lucknow',
    memoriesIds: ['mem-004', 'mem-005', 'mem-006'],
    prose: `The train from Varanasi to Allahabad takes approximately two hours. In 1963, for Ramesh Sharma, it took considerably longer — not in minutes, but in terms of what was left behind and what was entered. He was twenty-one years old, carrying one suitcase and sixty rupees, and he did not stop moving for the next twenty years.\n\nAllahabad University gave him a degree in History and an argument about an unreturned library book that would, within two years, become a marriage. Savitri Pandey had read more widely than anyone he had ever met, disagreed with equal precision, and had absolutely no intention of marrying someone her father selected for her. The library book in question was *The Discovery of India* by Jawaharlal Nehru, which Ramesh has since re-read seven times and continues to argue about.\n\nThey married in 1970. By 1972 he was teaching. By 1975 he held his daughter for the first time and discovered, at thirty-three years of age, that he did not know what to do with his hands.`,
  },
  {
    id: 'ch-career',
    title: 'The Work',
    subtitle: 'Lucknow & Mumbai, 1972–2007',
    yearStart: 1972,
    yearEnd: 2007,
    location: 'Lucknow & Mumbai',
    memoriesIds: ['mem-006', 'mem-008'],
    prose: `Ramesh Sharma spent thirty-five years in classrooms, and it would be inaccurate to say this was his career. It was, more precisely, his vocation — the word in its original sense, meaning a calling. He was called to it early and never stopped hearing the call.\n\nPrincipal Saxena's two sentences — *prepare for ten years, teach from the moment* — became the operating principle of a professional life that took him from the no-wall classroom in Varanasi to a staff room in Lucknow to the principal's office of St. Xavier's Vidyamandir in Mumbai, where for seventeen years he ran a school of eight hundred students with the same combination of preparation and presence that Saxena had identified in him at the beginning.\n\nHe retired in 2007. The farewell function lasted four hours. Former students came from six cities. Two of them, now teachers themselves, stood up and repeated, word for word, the same two sentences he had passed on to them.`,
  },
  {
    id: 'ch-legacy',
    title: 'The Legacy',
    subtitle: 'Mumbai, 1983–Present',
    yearStart: 1983,
    yearEnd: 2024,
    location: 'Mumbai',
    memoriesIds: ['mem-009', 'mem-010'],
    prose: `There is a glass jar on the windowsill of the flat in Bandra West. It contains soil from a garden in Varanasi that no longer exists — the house was demolished in 1984, the garden replaced by a concrete building with twelve apartments. The soil is still there.\n\nRamesh Sharma is eighty-two years old. He walks to the park every morning with a cane his daughter bought him and argues with nobody in particular about the state of things. He has been a son, a student, a husband, a teacher, a father, a principal, a grandfather. He has lived in three cities and crossed the country at least forty times and taught more than two thousand students and made, by his own count, six hundred and fourteen chapatis from scratch.\n\nThe stories he tells — about the Murphy Radio, about the floods, about his father on the station platform, about Savitri returning a library book — are not simply anecdotes. They are the structure of a life. They are the roots, the branches, the leaves of everything that came after.\n\nThey are why MemoirEngine exists.\n\n*These stories shouldn't disappear.*`,
  },
];

// Demo WOW sequence data
export const DEMO_WOW_SEQUENCE = {
  question: "You once told me about the house where you grew up. What do you remember hearing there in the mornings?",
  audioLength: 38, // seconds simulated
  transcript: "The sounds I remember most are the temple bells. Every morning at five, the Kashi Vishwanath temple bells would start, and then the whole city would wake up together. My mother would light the lamp and my father would be already sitting with his chai, reading. The Murphy Radio would sometimes have the morning news, very soft. And outside — the milkman's bicycle bell, the koel bird, water being poured. The city had a morning sound that was its own thing.",
  entities: [
    { type: 'place', label: 'VARANASI' },
    { type: 'object', label: 'MURPHY RADIO' },
    { type: 'person', label: 'FATHER' },
    { type: 'person', label: 'MOTHER' },
    { type: 'place', label: 'KASHI VISHWANATH' },
    { type: 'year', label: 'c. 1950' },
    { type: 'emotion', label: 'BELONGING' },
  ],
  memoryTitle: 'The Morning Sounds of Varanasi',
  memoryYear: 1950,
  memoryLocation: 'Varanasi, Uttar Pradesh',
  generatedProse: `Every morning began with bells.\n\nThe Kashi Vishwanath temple announced the day at five o'clock, its bronze voice travelling through the lanes of the old city, over the rooftops, into the room where Ramesh lay half-awake on his charpoy. He would hear his mother's small sounds in the kitchen — the striking of a match, the glass shade of the brass lamp being lifted and replaced — and then his father's cough and the soft scrape of a chai cup on the floor.\n\nThe Murphy Radio would murmur the morning news, barely audible, as if the world's events were too large for the early hour. Outside: the milkman's bicycle bell, the liquid call of a koel bird in the mango tree, the ritual sound of water being poured. The whole city waking simultaneously, as it had every morning for centuries, pulled into consciousness by the same bell.\n\n"The city had a morning sound that was its own thing," he says. "I have lived in three cities since then. None of them sounded like that."`,
};
