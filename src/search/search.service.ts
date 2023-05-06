import { Injectable } from '@nestjs/common';
import { DDGTopic, DDGRelatedTopic, FinalTopic } from './dto/related-topic.dto';
import { localFileName,defaultName } from './search.constants';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class SearchService {
  constructor() {}

  async performSearch(q: string) {
    if (q.length === 0 || typeof q === 'undefined') {
      return [];
    }
    try {
      const fileName = localFileName;
      await this.writeStringToFile(fileName, `${q},`);
      const resultsArr: FinalTopic[] = [];
      const url = `http://api.duckduckgo.com/?q=${q}&format=json`;
      const res = await axios.get(url, {});
      const relatedTopics: (DDGTopic | DDGRelatedTopic)[] =
        res.data.RelatedTopics;

      if (relatedTopics.length === 0) {
        return [];
      }

      for (const topic of relatedTopics) {
        const data = await this.handleRelatedTopics(topic);
        resultsArr.push(data);
      }

      return resultsArr;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`${err.name} :::: ${err.message}`);
      }
    }
  }

  async handleRelatedTopics(topic: DDGTopic | DDGRelatedTopic) {
    const verify = this.isDDGTopic(topic);
    const finalTopic: FinalTopic = {
      Name: '',
      Results: [],
    };
    switch (verify) {
      case true: {
        finalTopic.Name = defaultName;
        finalTopic.Results = [(topic as DDGTopic).Result];
        break;
      }
      case false: {
        const res: string[] = [];
        for (const object of (topic as DDGRelatedTopic).Topics) {
          res.push(object.Result);
        }
        finalTopic.Name = (topic as DDGRelatedTopic).Name;
        finalTopic.Results = res;
        break;
      }
      default:
        break;
    }
    return finalTopic;
  }

  isDDGTopic(obj: any) {
    return obj.FirstURL !== undefined;
  }

  isDDGRelatedTopic(obj: any) {
    return obj.Name !== undefined;
  }

  private async writeStringToFile(fileName: string, data: string): Promise<void> {
    try {
      fs.readFileSync(fileName);
      fs.writeFileSync(fileName, data, { flag: 'a+' });
    } catch (err) {
      fs.writeFileSync(fileName, data);
    }
  }

  private async clearContentsOfFile(fileName: string) {
    fs.writeFileSync(fileName, '');
  }

  private async readStringArrayFromFile(fileName: string): Promise<string[]> {
    try {
      const data = fs.readFileSync(fileName, 'utf-8');
      const dataArray = data.split(',');
      dataArray.pop();
      return dataArray;
    } catch (err) {
      console.error(`Error reading file: ${err}`);
      return [];
    }
  }

  async getHistory(): Promise<string[]> {
    return await this.readStringArrayFromFile(localFileName);
  }

  async clearHistory(): Promise<void> {
    return await this.clearContentsOfFile(localFileName);
  }
}
