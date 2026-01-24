export interface Resource {
  id: string;
  title: string;
  category: "newborn" | "postpartum" | "sleep" | "partner" | "nutrition";
  content: string;
  readTime: number;
  tags: string[];
}

export const RESOURCES: Resource[] = [
  {
    id: "newborn-1",
    title: "Newborn Care Basics",
    category: "newborn",
    content: `Your newborn's first days involve learning their cues and establishing routines. Here are essential tips:

**Feeding**
- Feed every 2-3 hours or on demand
- Watch for hunger cues (rooting, hand to mouth)
- Burp after each feeding

**Sleep**
- Newborns sleep 14-17 hours a day
- Always place on back to sleep
- Watch for sleep cues

**Diapers**
- Expect 6-8 wet diapers per day
- Watch for bowel movement changes
- Keep skin clean and dry

**When to Call the Doctor**
- Fever over 100.4°F
- Not feeding well
- Fewer wet diapers than expected
- Unusual lethargy`,
    readTime: 5,
    tags: ["basics", "feeding", "sleep", "diaper"],
  },
  {
    id: "newborn-2",
    title: "Understanding Newborn Cues",
    category: "newborn",
    content: `Learn to read your baby's signals:

**Hunger Cues (Early)**
- Rooting reflex
- Hand to mouth
- Lip smacking

**Hunger Cues (Late)**
- Fussing
- Crying
- Agitated movements

**Sleep Cues**
- Yawning
- Eye rubbing
- Pulling at ears
- Zoning out

**Overstimulation**
- Turning away
- Arching back
- Flailing arms
- Crying`,
    readTime: 4,
    tags: ["cues", "communication", "signals"],
  },
  {
    id: "postpartum-1",
    title: "Postpartum Recovery",
    category: "postpartum",
    content: `Taking care of yourself after birth is essential:

**Physical Recovery**
- Rest when possible
- Stay hydrated
- Take prescribed pain medication
- Attend follow-up appointments

**Emotional Wellness**
- It's normal to feel overwhelmed
- Baby blues typically resolve in 2 weeks
- Watch for signs of postpartum depression
- Ask for help when needed

**Red Flags**
- Severe mood changes
- Thoughts of harming yourself or baby
- Inability to care for yourself or baby
- Hallucinations or delusions

**Seek Help If**
- Feelings persist beyond 2 weeks
- Difficulty bonding with baby
- Severe anxiety or panic attacks`,
    readTime: 7,
    tags: ["recovery", "mental-health", "self-care"],
  },
  {
    id: "postpartum-2",
    title: "Managing Postpartum Emotions",
    category: "postpartum",
    content: `Your emotions after birth are valid and important:

**Common Experiences**
- Mood swings ("baby blues")
- Anxiety about parenting
- Sleep deprivation effects
- Body image concerns

**Coping Strategies**
- Accept help from others
- Prioritize rest
- Connect with other parents
- Talk about your feelings

**When to Seek Help**
- Symptoms lasting over 2 weeks
- Difficulty caring for baby
- Intrusive thoughts
- Relationship difficulties

**Support Resources**
- Your healthcare provider
- Postpartum support groups
- Mental health professionals
- Trusted friends and family`,
    readTime: 6,
    tags: ["emotions", "mental-health", "support"],
  },
  {
    id: "sleep-1",
    title: "Understanding Baby Sleep",
    category: "sleep",
    content: `Babies sleep differently than adults:

**Newborn Sleep (0-3 months)**
- No day/night distinction
- Sleep in 2-4 hour blocks
- Total: 14-17 hours per day

**Sleep Cycles**
- Babies have shorter cycles
- More time in REM sleep
- Frequent arousals are normal

**Safe Sleep Guidelines**
- Back to sleep
- Firm, flat surface
- Room-sharing (not bed-sharing)
- No soft bedding or toys

**Common Concerns**
- Night waking is normal
- Sleep regressions happen
- Every baby is different`,
    readTime: 6,
    tags: ["sleep", "newborn", "safe-sleep"],
  },
  {
    id: "sleep-2",
    title: "Establishing Sleep Routines",
    category: "sleep",
    content: `Creating healthy sleep habits:

**Bedtime Routine Ideas**
- Bath
- Massage
- Feed
- Book/song
- Lights out

**Age-Appropriate Schedules**
- Newborn: No schedule yet
- 3-6 months: Every 2-3 hours
- 6-12 months: 2-3 naps/day

**Signs of Tiredness**
- Eye rubbing
- Yawning
- Fussiness
- Looking away

**Helping Baby Sleep**
- Dark room
- White noise
- Consistent routine
- Put down drowsy, not asleep`,
    readTime: 5,
    tags: ["sleep", "routine", "schedule"],
  },
  {
    id: "partner-1",
    title: "Partner Communication",
    category: "partner",
    content: `Maintaining connection with your partner:

**Daily Check-Ins**
- How are you really doing?
- What do you need?
- Small moments matter

**Sharing Responsibilities**
- Divide tasks fairly
- Rotate night duties
- Communicate expectations

**Intimacy After Baby**
- Be patient with each other
- Small gestures count
- Communicate needs
- It takes time

**Conflict Resolution**
- Choose your battles
- Use "I" statements
- Take breaks when needed
- Remember you're a team`,
    readTime: 5,
    tags: ["partner", "communication", "relationship"],
  },
  {
    id: "partner-2",
    title: "Division of Parenting Duties",
    category: "partner",
    content: `Finding what works for your family:

**Discussing Roles**
- Be open and honest
- Consider strengths
- Stay flexible
- Check in regularly

**Common Divisions**
- One parent handles feeding
- Alternate bath time
- Share morning duties
- Divide household tasks

**Tips for Success**
- Appreciate each other's efforts
- Don't keep score
- Adjust as needed
- Celebrate teamwork

**When Struggling**
- Seek couples counseling
- Talk to trusted friends
- Remember why you started
- Be patient with the process`,
    readTime: 4,
    tags: ["partner", "responsibilities", "teamwork"],
  },
  {
    id: "nutrition-1",
    title: "Nutrition for New Parents",
    category: "nutrition",
    content: `Taking care of your nutrition:

**Quick Meal Ideas**
- Overnight oats
- Pre-cut vegetables
- Easy protein sources
- Healthy snacks

**Hydration**
- Drink water throughout the day
- Keep water nearby while feeding
- Limit caffeine
- Watch for dehydration signs

**Energy-Boosting Foods**
- Complex carbs
- Protein-rich foods
- Healthy fats
- Fruits and vegetables

**Tips for Busy Parents**
- Meal prep when possible
- Accept delivered meals
- Keep healthy snacks available
- Don't skip meals`,
    readTime: 4,
    tags: ["nutrition", "healthy-eating", "hydration"],
  },
  {
    id: "nutrition-2",
    title: "Breastfeeding Nutrition",
    category: "nutrition",
    content: `Supporting your breastfeeding journey:

**Caloric Needs**
- Extra 300-500 calories/day
- Listen to your hunger cues
- No need to overeat

**Important Nutrients**
- Calcium (dairy, leafy greens)
- Iron (lean meats, beans)
- DHA (fatty fish)
- Protein (eggs, lean meats)

**Hydration**
- Drink to thirst
- Keep water accessible
- Watch urine output

**Foods to Enjoy**
- Variety is fine
- Some babies react to certain foods
- Caffeine in moderation
- Alcohol requires planning

**Common Concerns**
- Supply concerns
- Diet restrictions
- Medication safety
- Support resources`,
    readTime: 5,
    tags: ["nutrition", "breastfeeding", "diet"],
  },
];

export function getResourcesByCategory(category: string): Resource[] {
  if (category === "all") return RESOURCES;
  return RESOURCES.filter((r) => r.category === category);
}

export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase();
  return RESOURCES.filter(
    (r) =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.content.toLowerCase().includes(lowerQuery) ||
      r.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export const CATEGORIES = [
  { id: "all", label: "All", icon: "library" },
  { id: "newborn", label: "Newborn", icon: "happy" },
  { id: "postpartum", label: "Postpartum", icon: "heart" },
  { id: "sleep", label: "Sleep", icon: "moon" },
  { id: "partner", label: "Partner", icon: "people" },
  { id: "nutrition", label: "Nutrition", icon: "nutrition" },
] as const;
