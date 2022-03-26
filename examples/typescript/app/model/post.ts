import { Application } from "egg";
import UserFactory from './user';

export default function(app: Application) {
  const { Bone, BelongsTo, Column, DataTypes: { BIGINT, TEXT, STRING } } = app.model;

  class Post extends Bone {
    @Column({ autoIncrement: true })
    id: bigint;

    @Column(TEXT)
    content: string;

    @Column()
    description: string;

    @Column()
    userId: bigint;

    @BelongsTo()
    user: ReturnType<typeof UserFactory>;
  }

  return Post;
};
