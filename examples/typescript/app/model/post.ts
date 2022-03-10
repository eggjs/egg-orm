import { Application } from "egg";

export default function(app: Application) {
  const { Bone, Column, DataTypes: { BIGINT, TEXT, STRING } } = app.model;

  class Post extends Bone {
    @Column({ autoIncrement: true })
    id: bigint;

    @Column(TEXT)
    content: string;

    @Column()
    description: string;
  }

  return Post;
};
