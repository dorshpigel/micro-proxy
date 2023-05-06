export class DDGTopic {
  FirstURL: string;
  Icon: {
    Height: string;
    URL: string;
    Width: string;
  };
  Result: string;
  Text: string;
}

export class DDGRelatedTopic {
  Name: string;
  Topics: DDGTopic[];
}

export class FinalTopic {
  Name: string;
  Results: string[];
}
