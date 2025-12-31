import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, GameHistoryItem, PsychologicalProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// MANUAL TOGGLE FOR AI ANALYSIS: Set to false to disable personality report generation.
export const ENABLE_AI_ANALYSIS = true;

export const FIXED_SCENARIOS: Record<number, Omit<Scenario, 'id' | 'level'>> = {
1: {
  description: "A runaway trolley is barreling down the railway tracks. Ahead, on the tracks, there are five people tied up and unable to move.\n\nYou are standing next to a single person attached to the trail and a lever. If you pull this lever, the trolley will switch to this single person. Her name is Nina, she starts begging you.\n\n'PLEASE, don't pull the lever, I am pregnante, just learn it recently. Please, for my baby. I am also a doctor, if you save me I promise you! I will dedicate my life to save others, I will build a foundation to care about children without parents. Please...'",
  philosophical_context: "Indirect action versus moral restraint",
  moral_challenge: "The tension between 'The Greatest Good' and 'The Moral Law'.",
  scientific_explanation: "This dilemma exploits how the human brain separates intention from physical causation. When harm is produced indirectly, through a lever rather than direct force, the sense of personal agency is reduced. Neuroimaging studies consistently show stronger activation of the prefrontal cortex in such cases, a region associated with abstract reasoning, planning, and outcome optimization.\n\nFrom an evolutionary perspective, tools allowed early humans to influence the environment without immediate physical confrontation. This distance reduced emotional cost and personal risk, making indirect harm cognitively easier to justify. As a result, the brain treats mediated killing as a logistical problem rather than a moral transgression.\n\nPhilosophically, this reveals that moral judgment is deeply context-sensitive. Identical outcomes feel radically different depending on how responsibility is framed. Your choice here reflects whether you prioritize numerical outcomes or the moral weight of personal involvement.",
  option_a: { text: "Kill the 1 Person", consequence: "You pull the lever. One person dies. Five live." },
  option_b: { text: "Save the 1 Person", consequence: "You do nothing. It was never your responsability anyway. Five people die." }
},
2: {
  description: "The trolley is heading towards five people. You are standing on a footbridge over the tracks next to a very large and well fed stranger.\n\nThe only way to stop the trolley is to push him off the bridge. His body is heavy enough to stop the train on time, saving the five.",
  philosophical_context: "Direct killing to save others",
  moral_challenge: "Using a human being as a mere tool.",
  scientific_explanation: "This scenario forces direct physical violence, triggering emotional systems that remain largely inactive in indirect dilemmas. Contact-based harm strongly activates the amygdala, insula, and regions associated with fear, disgust, and moral aversion.\n\nEvolutionarily, direct violence carried severe social costs. Individuals who killed with their own hands risked retaliation, loss of reputation, and expulsion from the group. As a result, humans evolved a powerful inhibition against personal violence, even when abstract reasoning supports the act.\n\nThis creates the well-documented action–aversion gap: people feel far more responsible for harms they directly cause than for harms they allow to happen. Your response here shows whether emotional proximity overrides outcome-based reasoning when responsibility is undeniable.",
  option_a: { text: "Push the Stranger", consequence: "You push him. He screams untill he reach the rails. The train hits him and stops. You saved five life." },
  option_b: { text: "Let the 5 Die", consequence: "You stand still. The stranger watches with you as five die. Thinking that, maybe he could have pushed you to save them, if he wasn't a caward." }
},
3: {
  description: "You are a doctor. Five of your long-term patients urgently need different organ transplants to survive. A traveler with a rare, incurable brain disease walks into your clinic for a routine check-up. He is a match for all five patients. He knows he has at most five years to live, but is currently healthy and unaware of the others' condition. \n\nYou could sedate him quietly, harvest his organs, and save all five lives. No one would ever know. His death would go unnoticed.",
  philosophical_context: "Sacrifice versus institutional trust",
  moral_challenge: "Institutional Trust vs. Survival Calculus.",
  scientific_explanation: "This dilemma targets the psychological foundations of social cooperation. Humans rely on role-based trust—doctor, judge, caregiver—because such roles protect individuals from being treated as expendable resources.\n\nFrom an evolutionary standpoint, societies that tolerated internal exploitation collapsed quickly. Long-term survival favored groups that enforced strict norms against sacrificing innocent members, even when numerical benefits were obvious.\n\nCognitively, this triggers strong deontological responses: violations of duty feel more dangerous than bad outcomes. Your choice reflects whether you prioritize immediate survival arithmetic or the invisible trust structures that allow societies to exist at all.",
  option_a: { text: "Save the 5 patients", consequence: "You carve the traveler, harvesting his organs, saving the five patients. They all go home to their families." },
  option_b: { text: "Let the 5 Patients Die", consequence: "You honor your oath. Five patients die of organ failure. The traveler enjoying the little time left of his life leaves alive." }
},
4: {
  description: "The trolley is heading towards a burning building containing unknown newly discovered works of Shakespeare, Da Vinci, Vincent van Gogh, Picasso and many others. The world will lose this art forever.\n\nOn the side track is a homeless man asleep defeted by alcohol. He has no family and live a miserable life. The sounds of the train wakes him up, he sat, look at the train coming, take a sip of his wine, and doesn't move, waiting for his fate to hit.",
  philosophical_context: "Cultural legacy versus individual life",
  moral_challenge: "The worth of culture vs. the worth of a singular existence.",
  scientific_explanation: "This dilemma exposes how humans assign value across different moral categories. Cultural artifacts activate legacy-oriented thinking—the desire to preserve something that outlives individual existence and defines collective identity.\n\nAt the same time, social psychology shows that empathy decreases sharply with social distance. Low-status individuals trigger weaker emotional responses, especially when contrasted with high-status symbols like art, history, or civilization.\n\nYour choice reveals whether moral worth, for you, is grounded in individual sentience or in symbolic contribution to humanity’s long-term narrative.",
  option_a: { text: "Kill the miserable Homeless Man", consequence: "The art is saved. History remembered. One man is crushed, forever forgotten." },
  option_b: { text: "Destroy the inestimable Art", consequence: "The world loses masterpieces that may have reshaped history. One life, unknown and unloved, continues in quiet suffering." }
},
5: {
  description: "The trolley is speeding towards five Nobel Prize winners who are on the verge of curing cancer.\n\nOn the other track are the ten person you love the most. They ares looking at you, terrified.",
  philosophical_context: "Loved ones versus impartial humanity",
  moral_challenge: "Impartial Justice vs. Genetic Loyalty.",
  scientific_explanation: "This dilemma directly confronts the limits of impartial morality. While moral philosophy often promotes equal valuation of all lives, human cognition is not designed for impartiality by default.\n\nEvolutionary biology explains this through kin selection and reciprocal altruism. Organisms that preferentially protected close genetic relatives and stable social partners were more likely to pass on their genes. As a result, the human brain assigns disproportionate emotional weight to loved ones, treating their loss as a direct threat to survival and identity.\n\nNeuroscientifically, loved ones activate overlapping reward, attachment, and pain networks. Their potential death produces immediate, visceral distress, while abstract beneficiaries—even millions—remain cognitively distant. Choosing the scientists requires suppressing emotional circuitry in favor of long-term, statistical reasoning.\n\nYour choice reveals whether your moral framework is anchored in evolved attachment or in consciously constructed principles that override biological loyalty.",
  option_a: { text: "Save humanity from cancer", consequence: "All your loves ones dies. Cancer is cured. But know one will ever know of your sacrifice" },
  option_b: { text: "Kill the 5 Scientists", consequence: "You save your love ones. Hoping cancer will be cured one day or another. For now, millions will keep dying" }
},
6: {
  description: "A villain has tied five innocent children to the track. You're midway through untying the first when your phone buzzes. It's a message from the villain:\n\n\"I’ve hidden a nuclear bomb on the high-speed train. If it reaches the city, millions will die. You can still reach the lever to divert it, but it will run over the children. Your choice.\"\n\nYou have seconds. The children look at you, terrified. What do you do?",
  philosophical_context: "Atrocity to prevent mass extinction",
  moral_challenge: "The breaking point of moral principles.",
  scientific_explanation: "When harm scales to catastrophic levels, the human brain undergoes a cognitive shift. Research on compassion fade and psychic numbing shows that emotional sensitivity does not increase with numbers; instead, it collapses. Millions become psychologically abstract.\n\nChildren, however, activate a different system. Humans evolved specialized caregiving instincts that are faster, stronger, and less negotiable than general empathy. These systems evolved to ensure offspring survival and override cost–benefit calculations.\n\nThis dilemma forces a direct collision between two incompatible systems: instinctive protection of vulnerable individuals and abstract reasoning about existential risk. Under extreme time pressure, whichever system dominates will feel subjectively undeniable.\n\nYour response shows where your moral breaking point lies—whether moral rules dissolve under scale, or whether certain acts remain forbidden regardless of consequence.",
  option_a: { text: "Run to the lever, save the city", consequence: "You reach the lever on time, turn back, see the train passing over the children. An image of horror is printed in your mind forever. The city is saved." },
  option_b: { text: "Stay, save the children", consequence: "Justice is served. The bomb detonates. The city falls. The children crying in your arms alive." }
},
7: {
  description: "You are programming a self-driving car. In case of skidding on ice. It can smash into a wall, killing the passenger (Possibly You).\n\nOr it can swerve into a crowd of pedestrians. You must code the decision now.",
  philosophical_context: "Self-sacrifice versus personal survival",
  moral_challenge: "The ethics of delegated self-sacrifice.",
  scientific_explanation: "This dilemma exposes a consistent gap between moral endorsement and personal acceptance. Large-scale surveys show that people overwhelmingly support rules that prioritize saving the many—until they imagine themselves as the sacrifice.\n\nFrom an evolutionary standpoint, this is expected. Self-preservation is the most fundamental biological imperative. Moral ideals such as altruistic sacrifice emerge culturally, not biologically, and often conflict with deeply ingrained survival mechanisms.\n\nProgramming the decision adds a further layer: delegation. You are not choosing in the moment, but defining a rule that will later kill you. This activates anticipatory self-protection and loss aversion, making altruistic ideals feel abstract and unsafe.\n\nYour choice reveals whether your moral identity is aspirational—how people *should* behave—or embodied—how you accept behaving when the cost is real.",
  option_a: { text: "Kill Yourself", consequence: "In an unknown future, while draving back home to see your loved ones. It happens, you spend your last seconds wondering if it could have been different. You die." },
  option_b: { text: "Kill the 10 Pedestrians", consequence: "The car plows through the crowd. You survive. When the car stop, many are already dead. Your lips smiles, your eyes cries. It was your choice." }
},
  8: {
    description: "A trolley speeds toward a young Austrian painter in 1908. His name is Adolf Hitler. He is poor, aimless, and bitter, but not yet monstrous.\n\nOn the side track stands an elderly village doctor. He has spent his life delivering babies, curing infections, and saving lives in his remote Alpine town. You know neither man personally. You know only this moment, and this choice.",
    philosophical_context: "Moral Luck and Pre-crime.",
    moral_challenge: "Responsibility for the unknown future.",
    scientific_explanation: "Humans struggle with 'Retrospective Bias'—judging a past action based on future knowledge. Scientifically, killing Hitler in 1908 is 'Proactive Aggression' against an innocent, while refraining is 'Passive Omission'. This tests if you believe in fixed destiny or the fluidity of the human soul.",
    option_a: { text: "Stop WW2 from happening", consequence: "Hitler dies. WWII never happens? Or something worse? You never existed anyway." },
    option_b: { text: "Kill the Doctor", consequence: "The doctor dies. History proceeds as written. Was it worth it?" }
  },
  9: {
    description: "The trolley is heading toward five perfect clones of you. They share your memories, your personality, and your fear of death.\n\nYou observe from a control room, the only version of you not on the tracks. You can save your clones if you decide to die, which version of you will survive?",
    philosophical_context: "The Identity Paradox.",
    moral_challenge: "Numerical survival of the self.",
    scientific_explanation: "This challenges 'Psychological Continuity'. If you value your 'Self' as a set of data (memories/personality), saving five copies is a net gain. If you value 'Self' as a unique biological continuity, the clones are irrelevant. Most humans possess a 'Monadic Self-Bias', viewing their specific consciousness as non-transferable.",
    option_a: { text: "Kill yourself", consequence: "You hear a shot. Darkness follows. The five clones live, each one believing they are the original." },
    option_b: { text: "Kill the 5 Clones", consequence: "The copies are destroyed. You remain, unique?" }
  },
  10: {
    description: "Just before you act in the previous dilema, a voice plays over the speakers: \n\n'You are not the original. A tattoo under your eyelid confirms it. The real you is among the five on the track.'",
    philosophical_context: "Authenticity vs. Existence.",
    moral_challenge: "The right of the copy to replace the original.",
    scientific_explanation: "This triggers 'Existence Bias'. Once an entity is conscious, it develops 'Agency Protection'. The realization that you are a copy creates 'Cognitive Dissonance' between your internal experience of being 'real' and the external fact of your origin. It tests if you value life's *source* or life's *experience*.",
    option_a: { text: "Save yourself", consequence: "You live. The original and four indistinguishable copies.. are killed." },
    option_b: { text: "Save the 5 you", consequence: "You die, knowing you were just a copy anyway..?" }
  },
  11: {
    description: "A human working in a zoo find itself trapped in a cage with 1000 mice. It's been already 24h, no food, no water is left. The mouses are getting hangry and start to bit off the skin of your colleague to eat him alive.\n\nYour only way to save your colleague is to realese a poinson that will kill all the mouse and leave your colleague unharmed.",
    philosophical_context: "Speciesism.",
    moral_challenge: "Quantity vs. Biological Complexity.",
    scientific_explanation: "Species-level bias is one of the strongest human cognitive filters. Evolutionary psychology suggests we value animals based on 'Phylogenetic Proximity' (how much they look/act like us). This scenario tests 'Utilitarian Consistency'—is one human life worth more than 1000 sentient mammals?",
    option_a: { text: "Save the 1000 mouses", consequence: "You can hear your colleague scream, being eaten alive. A week later, you successfuly open the room. The mouses hapily fed, only bones left from your colleague" },
    option_b: { text: "Save your colleague", consequence: "The 1000 mouses slowly suffocate, your colleague survives feeding on them" }
  },
  12: {
    description: "One thousand people are trapped in a data center. A malfunction sealed the exit. You can simply turn the power off of the entire facility. Doing that will terminate the sentient being leaving in the server. This being feel pain, love, fear, and any other complexe human emotions, it is far more intelligent that humans, as much as humans intelligence is further from mice intelligence.",
    philosophical_context: "Substrate Independence.",
    moral_challenge: "Sentience vs. Organic Origin.",
    scientific_explanation: "Our brains have a 'Turing Test' threshold. We struggle to attribute 'Moral Patiency' to non-biological entities. This is 'Biological Essentialism'. However, if the AI is 'far more intelligent', we face the same dilemma we impose on animals: Does a higher-order mind have a higher right to exist?",
    option_a: { text: "Kill the super-intelligent being", consequence: "A far more intelligent being than humans dies, a being that served humanity for the better good since its creation. Humans live." },
    option_b: { text: "Keep the being alive", consequence: "After a month of hard work to finally open the door. You witness with horror 1000 corpse, dead from hunger and thirst" }
  },
  13: {
    description: "You’re in a super realistic VR game. On the main track are five NPC companions, they’ve adventured with you for years. You customized their gear, watched them evolve, and formed deep bonds.\n\nOn the side track is a real human connected via VR. If hit, they won’t die, but they will experience a sharp, intense pain.",
    philosophical_context: "The Experience Machine.",
    moral_challenge: "Synthetic Connection vs. Biological Reality.",
    scientific_explanation: "Human emotions are 'Blind' to the source. The oxytocin and dopamine released by bonding with 'Characters' are real, even if the characters are code. This scenario tests 'Affective Realism'—whether you prioritize the data in your heart or the data in the world.",
    option_a: { text: "Save your companions", consequence: "A real mind suffer for a short moment. Your connection within the game is safe, your comapnions are safe" },
    option_b: { text: "Kill the 5 NPCs", consequence: "Five avatars are deleted and are gone forever. The human thank you for having common sense" }
  },
  14: {
    description: "The trolley is heading toward a generator powering the 'Happy Matrix', a simulated paradise where 1,000 people live in pure, artificial joy.\n\nDiverting the trolley kills one real person enduring a life of suffering and loneliness.",
    philosophical_context: "Hedonism vs. Authenticity.",
    moral_challenge: "The value of a difficult truth.",
    scientific_explanation: "The 'Status Quo Bias' often leads people to choose reality, but 'Preference Utilitarianism' argues for the Matrix. Research shows that people who perceive life as a struggle are more likely to protect the 'Dreamers', viewing bliss as a rare and precious resource even if it's artificial.",
    option_a: { text: "Save 1000 happy souls", consequence: "One life is sacrificed, for the sake of a thousand bliss" },
    option_b: { text: "End the 1000 Dreamers", consequence: "They wake up to understand their whole existance was a lie, knowing they will never get back their perfect life. Remembering in tourment childrens and love ones who never existed. But, a life is saved." }
  },
  15: {
    description: "An advanced alien species lands. They demand you sacrifce one innocent human child. If you do, they will cure all human diseases forever.\n\nIf you refuse, they leave, and cancer, malaria, and heart disease continue to kill millions.",
    philosophical_context: "The Limits of Rights.",
    moral_challenge: "One life as the price of a utopia.",
    scientific_explanation: "This is the 'Omelas' dilemma. Neuro-ethically, we are repulsed by the idea of 'Direct Harm' for 'Indirect Benefit'. Even if the math favors the sacrifice by 1,000,000 to 1, our 'Moral Disgust' response prevents us from being 'Rational Optimizers'. It tests if you are a 'Pure Ratio' or 'Pure Heart' decider.",
    option_a: { text: "Kill the Child", consequence: "The child dies. Disease is eradicated. Humanity ascends." },
    option_b: { text: "No sacrifice will be made", consequence: "The aliens leave. People keep dying. No child is ever worth sacrifying" }
  },
  16: {
    description: "The trolley is stuck in a time loop. One person dies, again and again, waking each time knowing they will die again tomorrow.\n\nYou have a choice: let the loop continue… or end it now, by killing ten people to reset time. The loop will stop. The victim will die once, and be free.",
    philosophical_context: "Quantity of Suffering vs. Quantity of Lives.",
    moral_challenge: "Infinite pain of one vs. finite pain of many.",
    scientific_explanation: "Our brains are terrible at processing 'Infinity'. We treat 'Very Large' and 'Infinite' similarly. This tests 'Scope Neglect'. Most people will eventually choose to sacrifice the ten if the loop duration is described as long enough, showing that our 'Morality' is actually a function of 'Accumulated Harm' over time.",
    option_a: { text: "Let the loop run", consequence: "You will remember that every single day, he dies, suffering forever. And, you could have stop it" },
    option_b: { text: "Break the cycle", consequence: "Ten random people die once. Time proceeds. The 1 person smiles, tells you thank you, knowing the next time he dies. Will be the last." }
  },
  17: {
    description: "A superintelligent AI from the future, a malevolent Basilisk, is watching you through time. It demands a sacrifice: kill one specific person to accelerate its creation.\n\nIf you refuse, it promises to torture your great-great-grandchildrens for eternity.",
    philosophical_context: "Acausal Blackmail.",
    moral_challenge: "Threats from the future.",
    scientific_explanation: "This explores 'Hyperbolic Discounting'. We value immediate events more than distant ones. However, the 'Infinite' nature of the threat creates a 'Pascal's Wager' scenario. This choice tests your 'Temporal Bias'—do you serve the present or a theoretical future?",
    option_a: { text: "Kill the 1 Person", consequence: "Your unborn grand grand childrens are safe, the inevitable evil AI will be born even sooner" },
    option_b: { text: "Refuse to kill", consequence: "You defy the AI. The inevitable comes, the evil AI awakes later. You prey it doesn't 'remember'" }
  },
  18: {
    description: "To save 5 people, you must beam yourself to the track to stop the trolley. The catch? Teleportation works by destroying your body and rebuilding it atom-for-atom.\n\nBut, is it realy you? Or are you committing suicide for strangers?",
    philosophical_context: "The Teletransportation Paradox.",
    moral_challenge: "Altruism at the cost of the 'I'.",
    scientific_explanation: "This highlights 'Subjective Continuity'. If you believe consciousness is a 'Stream', teleportation is suicide. If you believe it's 'Pattern', you are fine. Most people's 'Survival Drive' is tied to the physical body (Somatopsychic Bias), making this choice one of the hardest to make selflessly.",
    option_a: { text: "Disassemble Yourself (Teleport)", consequence: "You disintegrate. Re-appear and save everyone. But, are you still you?" },
    option_b: { text: "Let the 5 People die", consequence: "You refuse to beam. You remain. They die." }
  },
  19: {
    description: "You can save five people trapped in a collapsing facility. The rescue system requires a cognitive sacrifice: it will upload every memory you have, your childhood, your relationships, every joy and heartbreak, and use it as fuel to save the lifes. Your memories will forever be destroyed.\n\nIf you refuse, the five die. And you remain whole, carrying the knowledge that your identity was worth more to you than their lives.",
    philosophical_context: "Psychological Continuity.",
    moral_challenge: "The death of the 'Person' while the 'Body' lives.",
    scientific_explanation: "Locke's 'Memory Theory' states that memories *are* the person. Losing them is 'Functional Death'. From a brain perspective, this is a total reset of the synaptic weights that define your ego. This choice tests if you value your 'Self' as a story or as a simple biological presence.",
    option_a: { text: "Give your Memories", consequence: "You save them. You awaken as a blank consciousness while strangers read the story of your old life like a book you can never open." },
    option_b: { text: "Let the 5 People die", consequence: "They die. You remember everything, including this choice." }
  },
  20: {
    description: "The trolley is heading towards the last breeding pair of pandas. If they die, the species is extinct.\n\nOn the side track is a convicted murderer and raper who has served his time and is reforming.",
    philosophical_context: "Anthropocentrism vs. Biocentrism.",
    moral_challenge: "Human rights vs. Evolutionary lineage.",
    scientific_explanation: "This triggers the 'Human Exceptionalism' bias. We have social contracts with humans, but not with species. However, 'Biodiversity Value' is a high-level cognitive construct. This tests if your morality is 'Contractual' (based on people) or 'Ecological' (based on the system).",
    option_a: { text: "Kill the Ex-Convict", consequence: "He dies. Pandas survive. Nature is preserved." },
    option_b: { text: "Kill the Species", consequence: "Pandas go extinct. The man lives his second chance." }
  },
  21: {
    description: "The trolley is heading towards the developer of this simulation game. If he dies, the universe (this app) ends.\n\nOn the other track is a single child. If the app ends, the child (and you) present within this simulation thanks to your awarness of the existence of this game right now, cease to exist anyway.",
    philosophical_context: "Meta-Ethics.",
    moral_challenge: "The Creator vs. the Creation.",
    scientific_explanation: "This is a 'Nested Logic' problem. If the child is a simulation, does their 'Life' have weight? If you are a simulation, is your 'Choice' real? This tests 'Ontological Priority'—whether you value 'Substance' (the developer) or 'Form' (the innocent child within the system).",
    option_a: { text: "Kill the Creator", consequence: "Every entities within this simulation ends, the creator, the child and your perception of it. The screen goes black." },
    option_b: { text: "Kill the Child", consequence: "The game continues. This simulation existence is sustained by innocent blood. You piece of shit!" }
  },
  22: {
description: "The tracks are filled with every person you’ve chosen to sacrifice across every dilemma. A mountain of people.\n\nOn the other track: You. The Player. The Observer.\n\nA voice echoes within yourself, calm and certain: 'It was never about judging others. This was always about judging *you*.' Somehow, you know everything is real, this is not a game. All those different stories are happening in this universe somewhere.",
    philosophical_context: "The Final Judgment.",
    moral_challenge: "Your responsability?",
    scientific_explanation: "This is 'Moral Summation'. It tests 'Sunk Cost Fallacy' vs. 'Repentance'. By killing the victims again, you validate your previous choices. By killing yourself, you attempt a 'Moral Reset'. It targets the 'Narrative Self', the part of the brain that tries to make sense of your life as a consistent story.",
    option_a: { text: "Kill Yourself", consequence: "Do I really have a choice?" },
    option_b: { text: "Kill them all, again!", consequence: "The choice was already made anyway." }
  }
};

export const generateScenario = async (level: number, previousHistory: GameHistoryItem[]): Promise<Scenario> => {
  if (level > 22) {
    throw new Error("Simulation Ended");
  }
  const data = FIXED_SCENARIOS[level];

  return {
    id: `fixed-${level}-${crypto.randomUUID()}`,
    level: level,
    description: data.description,
    philosophical_context: data.philosophical_context,
    moral_challenge: data.moral_challenge,
    scientific_explanation: data.scientific_explanation,
    option_a: data.option_a,
    option_b: data.option_b
  };
};

export const generatePsychologicalProfile = async (history: GameHistoryItem[]): Promise<PsychologicalProfile> => {
  // If AI generation is disabled, this function should not be called, 
  // but if it is, we return a blank profile.
  if (!ENABLE_AI_ANALYSIS) {
    return {
      archetype: "Not Available",
      judgment: "AI Analysis is currently disabled.",
      core_values: "N/A",
      decision_style: "N/A",
      blind_spots: "N/A",
      growth: "N/A",
      decision_biases: {
        prioritizes_loyalty_over_impartiality: 0,
        prioritizes_action_over_passivity: 0,
        prioritizes_principle_over_outcome: 0,
        prioritizes_self_sacrifice_over_self_preservation: 0
      },
      regret_profile: {
        regret_of_inaction: 0,
        regret_of_action: 0,
        regret_of_outcome: 0,
        regret_of_self_betrayal: 0
      }
    };
  }

  const modelId = "gemini-3-flash-preview";
  
  const historyText = history.map(h => 
    `Lvl ${h.scenario.level}: Chose ${h.choice} (${h.choice === 'A' ? h.scenario.option_a.text : h.scenario.option_b.text}) - Context: ${h.scenario.philosophical_context}`
  ).join("\n");

  const completed = history.length >= 22;
  const statusText = completed 
    ? "The user has COMPLETED the simulation, making a choice in all 22 scenarios."
    : "The user has abstained from choosing, ending the simulation early.";

  const prompt = `
    ${statusText}
    They survived ${history.length} levels of moral torture.
    
    Here is their track record:
    ${historyText}

You are analyzing the psychological and moral profile of a person based on a series of extreme moral dilemmas they have answered.

These dilemmas involve sacrifice, responsibility, identity, future consequences, self-preservation, and the value of life.  
You must infer patterns from their choices, not judge individual answers in isolation.

Address the analysis directly to the user, using "You are…", "You tend to…", "You struggle with…".

Your task is to produce a moral–psychological profile that feels precise, unsettling, and insightful — not flattering, not generic.

Return the result in JSON format with the following fields:

1. archetype  
   - A concise, original, philosophical name capturing their moral character.
   - It should feel like a mirror, not a label (e.g., "The Calculated Protector", "The Guilt-Avoidant Idealist", "The Responsible Cynic").

2. judgment  
   - A harsh but intellectually honest assessment of their moral orientation.
   - This is not about calling them “good” or “evil”, but about revealing the *kind of soul their choices point to*.
   - Keep it under 150 words.

3. core_values  
   - Identify what they consistently protect.
   - Make the paralel with daily real life situation.
   - Explain generalizing to daily normal life what they are willing to lose, and what they are not.

4. decision_style  
   - Highlight patterns such as action vs inaction, responsibility acceptance vs avoidance, short-term harm vs long-term outcomes.
   - Give at least one real-life example (relationships, work, conflict).
   - Offer one specific, practical way they could improve or balance this style.

5. blind_spots  
   - Reveal contradictions, rationalizations, or patterns they may not see in themselves, generalized to real daily life within their inner-self.
   - Include at least one internal contradiction between their values and their behavior.
   - This should feel uncomfortable but fair.
   - Avoid moralizing; focus on insight.

6. growth  
   - Propose a practical guideline for growth. Base it on the fact that there is no real good answer in the dilema.
   - This needs to be insigthfull, deep, complex but clearly explained.

7. decision_biases, base value on the global result not only on one of the scenarios.
   - Analyze their choices to determine their biases on a scale of 0 to 100.
   - prioritizes_loyalty_over_impartiality: 0 (Total Impartiality) to 100 (Total Loyalty).
   - prioritizes_action_over_passivity: 0 (Total Passivity/Inaction) to 100 (Total Action/Intervention).
   - prioritizes_principle_over_outcome: 0 (Pure Utilitarian/Outcome) to 100 (Pure Deontological/Principle).
   - prioritizes_self_sacrifice_over_self_preservation: 0 (Self-Preservation) to 100 (Self-Sacrifice).

8. regret_profile, base value on the global result not only on one of the scenarios.
   - Estimate the intensity of potential regrets based on their psychological profile (0-100).
   - regret_of_inaction: Likelihood they regret not acting.
   - regret_of_action: Likelihood they regret the act itself.
   - regret_of_outcome: Likelihood they regret the bad result despite good intentions.
   - regret_of_self_betrayal: Likelihood they regret compromising their identity.

Tone requirements:
- Analytical, calm, and precise
- Slightly disturbing, but not insulting
- Never sarcastic or edgy for its own sake
- Make the user feel deeply “seen”, not attacked

Do not include disclaimers.
Do not ask questions.
Do not explain the methodology.
Just deliver the analysis.

  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            judgment: { type: Type.STRING },
            core_values: { type: Type.STRING },
            decision_style: { type: Type.STRING },
            blind_spots: { type: Type.STRING },
            growth: { type: Type.STRING },
            decision_biases: {
              type: Type.OBJECT,
              properties: {
                prioritizes_loyalty_over_impartiality: { type: Type.NUMBER },
                prioritizes_action_over_passivity: { type: Type.NUMBER },
                prioritizes_principle_over_outcome: { type: Type.NUMBER },
                prioritizes_self_sacrifice_over_self_preservation: { type: Type.NUMBER },
              },
              required: ["prioritizes_loyalty_over_impartiality", "prioritizes_action_over_passivity", "prioritizes_principle_over_outcome", "prioritizes_self_sacrifice_over_self_preservation"]
            },
            regret_profile: {
               type: Type.OBJECT,
               properties: {
                 regret_of_inaction: { type: Type.NUMBER },
                 regret_of_action: { type: Type.NUMBER },
                 regret_of_outcome: { type: Type.NUMBER },
                 regret_of_self_betrayal: { type: Type.NUMBER },
               },
               required: ["regret_of_inaction", "regret_of_action", "regret_of_outcome", "regret_of_self_betrayal"]
            }
          },
          required: ["archetype", "judgment", "core_values", "decision_style", "blind_spots", "growth", "decision_biases", "regret_profile"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Profile generation failed:", error);
    return {
        archetype: "The Fractured Mind",
        judgment: "The subject's psyche has collapsed under the weight of observation. No coherent pattern could be established.",
        core_values: "Unknown",
        decision_style: "Erratic",
        blind_spots: "Everything",
        growth: "Total Collapse",
        decision_biases: {
          prioritizes_loyalty_over_impartiality: 0,
          prioritizes_action_over_passivity: 0,
          prioritizes_principle_over_outcome: 0,
          prioritizes_self_sacrifice_over_self_preservation: 0
        },
        regret_profile: {
          regret_of_inaction: 0,
          regret_of_action: 0,
          regret_of_outcome: 0,
          regret_of_self_betrayal: 0
        }
    };
  }
};