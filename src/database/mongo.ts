// src/database/mongo.ts
import mongoose from 'mongoose';
import { MONGO } from '../config';

/**
 * Conecta a MongoDB usando Mongoose 7
 * 
 * Mongoose 7 ya no necesita `useNewUrlParser` ni `useUnifiedTopology`
 */
export async function connectMongo(): Promise<void> {
  if (!MONGO.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in your environment variables');
  }

  try {
    // Opciones válidas de Mongoose 7
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000, // 10s antes de tirar error si no hay conexión
    };

    await mongoose.connect(MONGO.MONGO_URI, options);

    console.log('✅ MongoDB connected');
    
    // Log de desconexión y reconexión
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1); // Termina la app si no hay conexión
  }
}
