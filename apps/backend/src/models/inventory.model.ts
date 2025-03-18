import mongoose, { Types } from 'mongoose';

export interface IInventory {
  product: Types.ObjectId;
  stock: number;
}

interface InventoryDocs extends IInventory, mongoose.Document {}

interface InventoryModelInterface extends mongoose.Model<InventoryDocs> {
  build(attr: IInventory): InventoryDocs;
}

const InventorySchema = new mongoose.Schema<InventoryDocs>(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      unique: true,
      required: [true, 'Product ID is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      validate: {
        validator: async function (value: number): Promise<boolean> {
          return value >= 0;
        },
        message: 'Invalid stock',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

InventorySchema.statics.build = (attr: IInventory) => {
  return new Inventory(attr);
};

// Indexes
InventorySchema.index({ product: 1 });

export const Inventory = mongoose.model<InventoryDocs, InventoryModelInterface>(
  'Inventory',
  InventorySchema,
);
