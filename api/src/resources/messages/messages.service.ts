import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as moment from 'moment';
import * as Sentiment from 'sentiment';
import * as sentimentAnalysis from 'sentiment-analysis';
import * as sentiyapa from 'sentiyapa';
import * as vader from 'vader-sentiment';
import * as ml from 'ml-sentiment';
import * as winkSentiment from 'wink-sentiment';
import * as polarity from 'polarity';
import * as retextSentiment from 'retext-sentiment';
import * as english from 'retext-english';

import * as unified from 'unified';

import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('messages') private messageModel: Model<MessageDocument>
  ) {}

  private firstLib(texts) {
    const start = moment();

    const sentimental = new Sentiment();
    const results = texts.map((item) => {
      return sentimental.analyze(item.text).score;
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private secondLib(texts) {
    const start = moment();

    const results = texts.map((item) => {
      return sentimentAnalysis(item.text) * 10;
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private thirdLib(texts) {
    const start = moment();

    const s = new sentiyapa.Sentiyapa();
    s.init();
    const results = texts.map((item) => {
      return s.score(item.text) * 10;
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private fourthLib(texts) {
    const start = moment();

    const results = texts.map((item) => {
      return winkSentiment(item.text).score;
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private fifthLib(texts) {
    const start = moment();

    const results = texts.map((item) => {
      return (
        vader.SentimentIntensityAnalyzer.polarity_scores(item.text).compound *
        10
      );
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private sixthLib(texts) {
    const start = moment();

    const results = texts.map((item) => {
      return ml().classify(item.text);
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private seventhLib(texts) {
    const start = moment();

    const results = texts.map((item) => {
      return polarity(item.text.toLowerCase().match(/\S+/g)).polarity;
    });

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  private async eighthLib(texts) {
    const start = moment();

    // const results = await Promise.all(
    //   texts.map(async (item) => {
    //     return retext().use(retextSentiment).process(item.text);
    //   })
    // );
    const processor = unified().use(english).use(retextSentiment);
    const results = await Promise.all(
      texts.map(async (text) => {
        const tree = await processor.run(processor.parse(text));
        return tree.data.polarity;
      })
    );

    // const temp = await retext()
    //   // .use(profanities)
    //   .use(retextSentiment)
    //   .processSync('He’s set on beating your butt for sheriff! :cop:');
    // console.log(String(temp));

    return { time: moment().diff(start, 'milliseconds'), results };
  }

  async create(createCatDto: CreateMessageDto) {
    await Promise.allSettled(
      createCatDto.texts.map((text) => {
        try {
          const createdCat = new this.messageModel(new Message(text));

          return createdCat.save();
        } catch (error) {
          console.log('Duplication');
          return null;
        }
      })
    );
  }

  async findAll() {
    const results = await this.messageModel.find().exec();

    const lib1Result = this.firstLib(results);
    const lib2Result = this.secondLib(results);
    const lib3Result = this.thirdLib(results);
    const lib4Result = this.fourthLib(results);
    const lib5Result = this.fifthLib(results);
    const lib6Result = this.sixthLib(results);
    const lib7Result = this.seventhLib(results);
    const lib8Result = await this.eighthLib(results);

    const builded = results.map((item, index) => ({
      text: item.text,
      lib1: lib1Result.results[index],
      lib2: lib2Result.results[index],
      lib3: lib3Result.results[index],
      lib4: lib4Result.results[index],
      lib5: lib5Result.results[index],
      lib6: lib6Result.results[index],
      lib7: lib7Result.results[index],
      lib8: lib8Result.results[index],
    }));

    return {
      lib1Description: {
        name: 'sentiment',
        link: 'https://www.npmjs.com/package/sentiment',
        speed: `${lib1Result.time} millisecond`,
        configurable: true,
      },
      lib2Description: {
        name: 'sentiment-analysis',
        link: 'https://www.npmjs.com/package/sentiment-analysis',
        speed: `${lib2Result.time} millisecond`,
        configurable: false,
      },
      lib3Description: {
        name: 'sentiyapa.js',
        link: 'https://www.npmjs.com/package/sentiyapa',
        speed: `${lib3Result.time} millisecond`,
        configurable: false,
      },
      lib4Description: {
        name: 'wink-sentiment',
        link: 'https://www.npmjs.com/package/wink-sentiment',
        speed: `${lib4Result.time} millisecond`,
        configurable: false,
      },
      lib5Description: {
        name: 'vader-sentiment',
        link: 'https://www.npmjs.com/package/vader-sentiment',
        speed: `${lib5Result.time} millisecond`,
        configurable: false,
      },
      lib6Description: {
        name: 'ml-sentiment',
        link: 'https://www.npmjs.com/package/ml-sentiment',
        speed: `${lib6Result.time} millisecond`,
        configurable: false,
      },
      lib7Description: {
        name: 'polarity',
        link: 'https://www.npmjs.com/package/polarity',
        speed: `${lib7Result.time} millisecond`,
        configurable: true,
      },
      lib8Description: {
        name: 'retext-sentiment',
        link: 'https://www.npmjs.com/package/retext-sentiment',
        speed: `${lib8Result.time} millisecond`,
        configurable: true,
      },
      results: builded,
    };
  }

  async delete(name) {
    await this.messageModel.deleteOne({ name }).exec();
  }
}
