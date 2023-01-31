import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface UserModelProps
  extends Model<
    InferAttributes<UserModelProps>,
    InferCreationAttributes<UserModelProps>
  > {
  id: CreationOptional<Number>;
  name: String;
  accountNumber: Number;
  password: String;
  amount: Number;
  status: CreationOptional<UserStatus>;
}
