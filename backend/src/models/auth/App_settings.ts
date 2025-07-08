
import mongoose, { Schema, Document } from "mongoose";

export interface IAppSettings extends Document {
    appName: string;
    description: string;
    appLogo?: string; 
    city?: string;
    state?: string;
    country?: string;
    officePhone?: string;
    homePhone?: string;
    whatsapp?: string;
    contactEmail?: string;
}

const App_settings = new Schema<IAppSettings>({
    appName: { type: String, required: true },
    description: { type: String, required: true },
    appLogo: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    officePhone: { type: String },
    homePhone: { type: String },
    whatsapp: { type: String },
    contactEmail: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<IAppSettings>("AppSettings", App_settings);
