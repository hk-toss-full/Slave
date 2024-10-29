import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column()
    receiverId: number;

    @Column()
    workspaceId: number;

    @Column()
    data: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
