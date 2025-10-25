import { randomElement } from './randomUtil'

export const pluralNouns = [
    "Aliens", "Animals", "Antelopes", "Ants", "Apes", "Apples", "Baboons",
    "Bacteria", "Badgers", "Bananas", "Bats", "Bears", "Birds", "Bonobos",
    "Brides", "Bugs", "Bulls", "Butterflies", "Cheetahs", "Cherries", "Chicken",
    "Children", "Chimps", "Clowns", "Cows", "Creatures", "Dinosaurs", "Dogs",
    "Dolphins", "Donkeys", "Dragons", "Ducks", "Dwarfs", "Eagles", "Elephants",
    "Elves", "Fathers", "Fish", "Flowers", "Frogs", "Fruit", "Fungi",
    "Galaxies", "Geese", "Goats", "Gorillas", "Hedgehogs", "Hippos", "Horses",
    "LifeForms", "Lions", "Lizards", "Mice", "Monkeys", "Monsters", "Mushrooms",
    "Octopodes", "Oranges", "Orangutans", "Organisms", "Pants", "Parrots",
    "Penguins", "People", "Pigeons", "Pigs", "Pineapples", "Plants", "Potatoes",
    "Priests", "Rats", "Reptiles", "Reptilians", "Rhinos", "Seagulls", "Sheep",
    "Siblings", "Snakes", "Spaghetti", "Spiders", "Squid", "Squirrels",
    "Stars", "Students", "Teachers", "Tigers", "Tomatoes", "Trees", "Vampires",
    "Vegetables", "Viruses", "Vulcans", "Weasels", "Werewolves", "Whales",
    "Witches", "Wizards", "Wolves", "Workers", "Worms", "Zebras"
]

export const verbs = [
    "Abandon", "Adapt", "Advertise", "Answer", "Anticipate", "Appreciate",
    "Approach", "Argue", "Ask", "Bite", "Blossom", "Blush", "Breathe", "Breed",
    "Bribe", "Burn", "Calculate", "Clean", "Code", "Communicate", "Compute",
    "Confess", "Confiscate", "Conjugate", "Conjure", "Consume", "Contemplate",
    "Crawl", "Dance", "Delegate", "Devour", "Develop", "Differ", "Discuss",
    "Dissolve", "Drink", "Eat", "Elaborate", "Emancipate", "Estimate", "Expire",
    "Extinguish", "Extract", "Facilitate", "Fall", "Feed", "Finish", "Floss",
    "Fly", "Follow", "Fragment", "Freeze", "Gather", "Glow", "Grow", "Hex",
    "Hide", "Hug", "Hurry", "Improve", "Intersect", "Investigate", "Jinx",
    "Joke", "Jubilate", "Kiss", "Laugh", "Manage", "Meet", "Merge", "Move",
    "Object", "Observe", "Offer", "Paint", "Participate", "Party", "Perform",
    "Plan", "Pursue", "Pierce", "Play", "Postpone", "Pray", "Proclaim",
    "Question", "Read", "Reckon", "Rejoice", "Represent", "Resize", "Rhyme",
    "Scream", "Search", "Select", "Share", "Shoot", "Shout", "Signal", "Sing",
    "Skate", "Sleep", "Smile", "Smoke", "Solve", "Spell", "Steer", "Stink",
    "Substitute", "Swim", "Taste", "Teach", "Terminate", "Think", "Type",
    "Unite", "Vanish", "Worship"
]

export const adverbs = [
    "Absently", "Accurately", "Accusingly", "Adorably", "AllTheTime", "Alone",
    "Always", "Amazingly", "Angrily", "Anxiously", "Anywhere", "Appallingly",
    "Apparently", "Articulately", "Badly", "Barely",
    "Beautifully", "Blindly", "Bravely", "Brightly", "Briskly", "Brutally",
    "Calmly", "Carefully", "Casually", "Cautiously", "Cleverly", "Constantly",
    "Correctly", "Crazily", "Curiously", "Cynically", "Daily", "Dangerously",
    "Easily", "Evenly", "Everywhere", "Exactly", "Expectantly",
    "Extensively", "Ferociously", "Fiercely", "Finely", "Flatly", "Frequently",
    "Hard", "Hastily", "Heroically", "High", "Highly", "Hourly",
    "Intensely", "Jealously", "Jovially", "Kindly", "Lazily", "Lightly",
    "Loudly", "Lovingly", "Loyally", "Magnificently", "Malevolently", "Merrily",
    "Nowhere", "Objectively", "Obnoxiously", "Obsessively", "Obviously",
    "Rarely", "Recklessly", "Regularly", "Responsibly",
    "Rudely", "Ruthlessly", "Sadly", "Scornfully", "Seamlessly", "Seldom",
    "Selfishly", "Seriously", "Shakily", "Sharply", "Sideways", "Silently",
    "Sleepily", "Slightly", "Slowly", "Smoothly", "Softly", "Solemnly",
    "Tenderly", "Thoughtfully", "Tightly", "Uneasily", "Vanishingly",
    "Violently", "Warmly", "Weakly", "Wearily", "Weekly", "Weirdly", "Well",
    "Well", "Wildly", "Wisely", "Wonderfully", "Yearly"
]

export const adjectives = [
    "Abominable", "Accurate", "Adorable", "All", "Alleged", "Ancient", "Angry",
    "Anxious", "Appalling", "Apparent", "Astonishing", "Attractive", "Awesome",
    "Baby", "Bad", "Beautiful", "Benign", "Big", "Bitter", "Blind", "Blue",
    "Cautious", "Choppy", "Chosen", "Clever", "Cold", "Cool", "Crawly",
    "Crazy", "Creepy", "Cruel", "Curious", "Cynical", "Dangerous", "Dark",
    "Delicate", "Desperate", "Difficult", "Discreet", "Disguised", "Dizzy",
    "Dumb", "Eager", "Easy", "Edgy", "Electric", "Elegant", "Emancipated",
    "Flawed", "Flying", "Foolish", "Foxy", "Freezing", "Funny", "Furious",
    "Gentle", "Glorious", "Golden", "Good", "Green", "Green", "Guilty",
    "Hairy", "Happy", "Hard", "Hasty", "Hazy", "Heroic", "Hostile", "Hot",
    "Immense", "Impartial", "Impolite", "Indifferent", "Infuriated",
    "Insightful", "Intense", "Interesting", "Intimidated", "Intriguing",
    "Jealous", "Jolly", "Jovial", "Jumpy", "Kind", "Laughing", "Lazy", "Liquid",
    "Lonely", "Longing", "Loud", "Loving", "Loyal", "Macabre", "Mad", "Magical",
    "Mysterious", "Mystical", "Needy", "Nervous", "Nice", "Objective",
    "Obnoxious", "Obsessive", "Obvious", "Opinionated", "Orange", "Painful",
    "Passionate", "Perfect", "Pink", "Playful", "Poisonous", "Polite", "Poor",
    "Popular", "Powerful", "Precise", "Preserved", "Pretty", "Purple", "Quick",
    "Quiet", "Random", "Rapid", "Rare", "Real", "Reassuring", "Reckless", "Red",
    "Small", "Smart", "Smelly", "Smiling", "Smooth", "Smug", "Sober", "Soft",
    "Solemn", "Square", "Square", "Steady", "Strange", "Strong", "Stunning",
    "Subjective", "Successful", "Surly", "Sweet", "Tactful", "Tense",
    "Thoughtful", "Tight", "Tiny", "Tolerant", "Uneasy", "Unique", "Unseen",
    "Warm", "Weak", "Weird", "WellCooked", "Wild", "Wise", "Witty", "Wonderful",
    "Worried", "Yellow", "Young", "Zealous"
]

const CATEGORIES: Record<string, string[]> = {
    "_PLURALNOUN_": pluralNouns,
    "_VERB_": verbs,
    "_ADVERB_": adverbs,
    "_ADJECTIVE_": adjectives
}

const PATTERNS = [
    "_ADJECTIVE__PLURALNOUN__VERB__ADVERB_"
]

function hasTemplate(s: string): boolean {
    for (const template in CATEGORIES) {
        if (s.indexOf(template) >= 0) { return true }
    }

    return false
}

/**
 * Generates a room name from templated word lists.
 * If custom dictionary is provided, its lists override defaults.
 * @param customDictionary - Optional mapping of categories to word lists.
 * @returns Generated room name without separators.
 */
export function generateRoomWithoutSeparator(customDictionary?: Partial<typeof CATEGORIES>): string {
    let name = randomElement(PATTERNS) as string
    let categories: Record<string, string[]> = CATEGORIES
    if (customDictionary) {
        categories = {
            "_PLURALNOUN_": (customDictionary as any).pluralNouns || pluralNouns,
            "_VERB_": (customDictionary as any).verbs || verbs,
            "_ADVERB_": (customDictionary as any).adverbs || adverbs,
            "_ADJECTIVE_": (customDictionary as any).adjectives || adjectives
        }
    }
    while (hasTemplate(name)) {
        for (const template in categories) {
            const word = randomElement(categories[template]) as string
            name = name.replace(template, word)
        }
    }

    return name
}

// Legacy global

(globalThis as any).generateRoomWithoutSeparator = generateRoomWithoutSeparator


