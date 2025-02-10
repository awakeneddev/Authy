import Mongoose, { Document, Model, Schema } from "mongoose";

export interface IHero extends Document {
  title: string;
  sub_title: string;
  button_title: string;
  navigate_url: string;
  image: string;
  isActive: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const HeroSchema: Schema<IHero> = new Mongoose.Schema({
  title: { type: String, required: true },
  sub_title: { type: String, required: true },
  button_title: { type: String, required: true },
  navigate_url: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  seo: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: Array, of: String, required: true },
  },
});

const Hero: Model<IHero> =
  Mongoose.models.Hero || Mongoose.model<IHero>("Hero", HeroSchema);
export default Hero;
