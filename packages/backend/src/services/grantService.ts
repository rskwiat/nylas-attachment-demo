import { Grant, IGrant } from '../models/grantSchema';

export class GrantService {
  static async storeGrant(userId: string, grantId: string, email?: string, provider?: string): Promise<IGrant> {
    try {
      const existingGrant = await Grant.findOne({ userId });
      
      if (existingGrant) {
        // Update existing grant
        existingGrant.grantId = grantId;
        if (email) existingGrant.email = email;
        if (provider) existingGrant.provider = provider;
        return await existingGrant.save();
      } else {
        // Create new grant
        const newGrant = new Grant({
          userId,
          grantId,
          email,
          provider,
        });
        return await newGrant.save();
      }
    } catch (error) {
      console.error('Error storing grant:', error);
      throw new Error('Failed to store grant');
    }
  }

  static async getGrant(userId: string): Promise<IGrant | null> {
    try {
      return await Grant.findOne({ userId });
    } catch (error) {
      console.error('Error retrieving grant:', error);
      throw new Error('Failed to retrieve grant');
    }
  }

  static async getGrantId(userId: string): Promise<string | null> {
    try {
      const grant = await Grant.findOne({ userId });
      return grant ? grant.grantId : null;
    } catch (error) {
      console.error('Error retrieving grant ID:', error);
      throw new Error('Failed to retrieve grant ID');
    }
  }

  static async deleteGrant(userId: string): Promise<boolean> {
    try {
      const result = await Grant.deleteOne({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting grant:', error);
      throw new Error('Failed to delete grant');
    }
  }

  static async getAllGrants(): Promise<IGrant[]> {
    try {
      return await Grant.find({});
    } catch (error) {
      console.error('Error retrieving all grants:', error);
      throw new Error('Failed to retrieve grants');
    }
  }
}
