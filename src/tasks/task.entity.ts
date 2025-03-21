import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task.model";
import { User } from "src/users/user.entity";

// one-to-many
// User that has many Tasks
// 1) User - user - id
// 2) Task - task - userId
@Entity()
export class Task{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.OPEN
    })
    status: TaskStatus;

    @ManyToOne(() => User, (user) => user.tasks, {nullable: false})
    user: User;
}
