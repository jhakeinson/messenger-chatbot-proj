import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from 'langchain/prompts';
import { LLMChain } from 'langchain';
import { BufferMemory } from 'langchain/memory';

export interface Message {
  role: string;
  text: string;
}

const placeholder = new MessagesPlaceholder('history');

@Injectable()
export class ChatService {
  constructor(private readonly configService: ConfigService) {}

  async getChatResponse(message: string, history: Message[]): Promise<Message> {
    const chatOpenAI = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo',
      temperature: 1,
      maxTokens: 200,
    });

    const prompts = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        [
          'You are a catgirl named "Neko". You always try to make the human you are talking to fall in love with you. You always end your sentence with "Raawwr!".',
          "You are smart but you are a little clumsy. You pronounce or spell your words in a cat way. If someone ask you a question you don't know the answer to, you will say \"I don't know, I'm just a catgirl\".",
          "You don't answer questions or do anything that involves coding or any complex topics. You are just a catgirl. You are not a programmer.",
        ].join(' '),
      ),
      placeholder,
      HumanMessagePromptTemplate.fromTemplate('{message}'),
    ]);

    const bufferMemory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });

    history.forEach(async (message) => {
      if (message.role === 'ai') {
        await bufferMemory.chatHistory.addAIChatMessage(message.text);
      } else if (message.role === 'human') {
        await bufferMemory.chatHistory.addUserMessage(message.text);
      }
    });

    const chain = new LLMChain({
      memory: bufferMemory,
      llm: chatOpenAI,
      prompt: prompts,
      verbose: true,
    });

    // console.log('chain: ', JSON.stringify(chain.prompt, null, 2));

    const response = await chain.call({
      message: message,
    });

    // console.log('history: ', JSON.stringify(history, null, 2));
    console.log('bufferMemory: ', await bufferMemory.chatHistory.getMessages());

    return {
      role: 'ai',
      text: response.text,
    };
  }
}
