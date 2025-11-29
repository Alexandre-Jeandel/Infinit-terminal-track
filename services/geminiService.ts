import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Scenario, GameHistoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the Scenario generation
const scenarioSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A detailed, atmospheric, and disturbing description of the current trolley problem situation. It should be second-person ('You see...')."
    },
    philosophical_context: {
      type: Type.STRING,
      description: "A brief, dark philosophical insight about why this specific choice is difficult or what concept it represents (e.g. Utilitarianism vs Deontology, Existentialism, Nihilism)."
    },
    option_a: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "The label for the first lever pull (e.g. 'Divert to the left')." },
        consequence: { type: Type.STRING, description: "The immediate, visceral consequence of this choice." }
      },
      required: ["text", "consequence"]
    },
    option_b: {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "The label for the second lever pull (e.g. 'Do nothing')." },
        consequence: { type: Type.STRING, description: "The immediate, visceral consequence of this choice." }
      },
      required: ["text", "consequence"]
    }
  },
  required: ["description", "philosophical_context", "option_a", "option_b"]
};

export const generateScenario = async (level: number, previousHistory: GameHistoryItem[]): Promise<Scenario> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable for this iteration

  // Create a context summary from the last few choices to ensure variety, but don't overload context
  const recentHistory = previousHistory.slice(-3).map(h => 
    `Level ${h.scenario.level}: Choose ${h.choice === 'A' ? 'Option A' : 'Option B'} (${h.scenario.philosophical_context})`
  ).join("; ");

  let intensityPrompt = "";
  if (level === 1) {
    intensityPrompt = "Level 1: The Classic. A simple trolley problem. One person vs five people. Keep it grounded.";
  } else if (level < 5) {
    intensityPrompt = `Level ${level}: Increase the stakes. Involve personal relationships, innocents, or direct action vs inaction.`;
  } else if (level < 10) {
    intensityPrompt = `Level ${level}: The choices must become morally grotesque. Introduce complex metaphysical elements, torture, eternal recurrence, or sacrifice of the self vs the many.`;
  } else {
    intensityPrompt = `Level ${level}: MAXIMUM INTENSITY. Pure nightmare fuel. Cosmic horror moral dilemmas. Choices that shatter the concept of morality itself. There is no 'right' answer, only suffering.`;
  }

  const prompt = `
    You are the 'Terminal Operator', an AI designed to test the limits of human morality through an infinite trolley problem simulation.
    
    Current State:
    ${intensityPrompt}
    
    Recent History (Avoid repetition):
    ${recentHistory}

    Task:
    Generate a new trolley problem scenario. 
    It MUST be a binary choice (Option A or Option B).
    The tone should be dark, industrial, philosophical, and increasingly disturbing as the level rises.
    Do not be polite. Be descriptive and visceral.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scenarioSchema,
        systemInstruction: "You are a dark moral philosopher engine. You generate trolley problems that get progressively more disturbing, surreal, and impossible. You explore themes of utilitarianism, egoism, nihilism, and existential horror."
      }
    });

    const data = JSON.parse(response.text);

    return {
      id: crypto.randomUUID(),
      level: level,
      description: data.description,
      philosophical_context: data.philosophical_context,
      option_a: data.option_a,
      option_b: data.option_b
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for safety or error
    return {
      id: "fallback",
      level,
      description: "The fog descends. You cannot see the tracks, but you hear screams. The simulation is glitching due to the weight of your sins.",
      philosophical_context: "Epistemological uncertainty.",
      option_a: { text: "Pull the lever blindly", consequence: "Unknown suffering." },
      option_b: { text: "Stand still", consequence: "Unknown suffering." }
    };
  }
};

export const generatePsychologicalProfile = async (history: GameHistoryItem[]): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  const historyText = history.map(h => 
    `Lvl ${h.scenario.level}: Chose ${h.choice} - Context: ${h.scenario.philosophical_context}`
  ).join("\n");

  const prompt = `
    The user has abstained from choosing, effectively ending the simulation.
    They survived ${history.length} levels of moral torture.
    
    Here is their track record:
    ${historyText}

    Analyze their moral compass. Are they a Utilitarian? A Deontologist? A Coward? A Monster?
    Write a harsh, direct, and philosophical judgement of their soul based on these choices. 
    Keep it under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "The subject's mind has fractured beyond analysis.";
  }
};
