import type { AgentConfiguration, ExportPlatform, AgentExport } from '$lib/types/agent';

/**
 * Génère un export pour un agent dans un format spécifique
 */
export function generateAgentExport(
  agent: AgentConfiguration,
  format: ExportPlatform
): AgentExport {
  const baseFileName = `agent-${agent.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  switch (format) {
    case 'n8n':
      return {
        content: generateN8nWorkflow(agent),
        fileName: `${baseFileName}-workflow.json`,
        mimeType: 'application/json'
      };
      
    case 'make':
      return {
        content: generateMakeScenario(agent),
        fileName: `${baseFileName}-scenario.json`,
        mimeType: 'application/json'
      };
      
    case 'nodejs':
      return {
        content: generateNodeJSScript(agent),
        fileName: `${baseFileName}.js`,
        mimeType: 'application/javascript'
      };
      
    case 'rest':
      return {
        content: generateOpenAPISpec(agent),
        fileName: `${baseFileName}-api.json`,
        mimeType: 'application/json'
      };
      
    case 'ollama':
      return {
        content: generateOllamaPrompt(agent),
        fileName: `${baseFileName}-ollama.md`,
        mimeType: 'text/markdown'
      };
      
    default:
      throw new Error(`Format d'export non supporté: ${format}`);
  }
}

// Fonctions de génération pour chaque format

function generateN8nWorkflow(agent: AgentConfiguration): string {
  return JSON.stringify({
    name: `${agent.name} - Workflow`,
    nodes: [
      {
        parameters: {},
        name: "Start",
        type: "n8n-nodes-base.start",
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          text: agent.prompt,
          options: {}
        },
        name: "Prompt",
        type: "n8n-nodes-base.set",
        typeVersion: 1,
        position: [450, 300]
      },
      {
        parameters: {
          model: "gpt-4",
          options: {}
        },
        name: "LLM",
        type: "n8n-nodes-base.openAi",
        typeVersion: 1,
        position: [650, 300],
        credentials: {
          openAiApi: "openAiApi"
        }
      }
    ],
    connections: {
      Start: {
        main: [[{ node: "Prompt", type: "main", index: 0 }]]
      },
      Prompt: {
        main: [[{ node: "LLM", type: "main", index: 0 }]]
      }
    }
  }, null, 2);
}

function generateMakeScenario(agent: AgentConfiguration): string {
  return JSON.stringify({
    name: `${agent.name}`,
    description: agent.description,
    scenario: {
      input: {
        type: "object",
        properties: {
          query: { type: "string", title: "Query" }
        }
      },
      actions: [
        {
          module: "http",
          name: "Call OpenAI",
          parameters: {
            url: "https://api.openai.com/v1/chat/completions",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer {{config.openai_api_key}}"
            },
            body: {
              model: "gpt-4",
              messages: [
                { role: "system", content: agent.prompt },
                { role: "user", content: "{{input.query}}" }
              ]
            }
          }
        }
      ]
    }
  }, null, 2);
}

function generateNodeJSScript(agent: AgentConfiguration): string {
  return `// ${agent.name} - Agent
// Description: ${agent.description}

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function runAgent(input) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: \`${agent.prompt.replace(/`/g, '\\`')}\` },
        { role: "user", content: input }
      ],
    });
    
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error running agent:', error);
    throw error;
  }
}

// Exemple d'utilisation
// runAgent("Votre question ici").then(console.log);

module.exports = { runAgent };`;
}

function generateOpenAPISpec(agent: AgentConfiguration): string {
  return JSON.stringify({
    openapi: "3.0.0",
    info: {
      title: agent.name,
      description: agent.description,
      version: "1.0.0"
    },
    paths: {
      "/query": {
        post: {
          summary: "Interroger l'agent",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" }
                  },
                  required: ["query"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Réponse de l'agent",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      response: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, null, 2);
}

function generateOllamaPrompt(agent: AgentConfiguration): string {
  return `# ${agent.name}

## Description
${agent.description}

## Prompt System
\`\`\`
${agent.prompt}
\`\`\`

## Utilisation avec Ollama

1. Sauvegardez ce prompt dans un fichier (par exemple, \`${agent.name.toLowerCase().replace(/\s+/g, '-')}.md\`)
2. Utilisez-le avec Ollama :

\`\`\`bash
ollama run mistral -f ${agent.name.toLowerCase().replace(/\s+/g, '-')}.md
\`\`\`

## Exemple d'utilisation

\`\`\`
> Bonjour, comment puis-je t'aider aujourd'hui ?
\`\`\`
`;
}
