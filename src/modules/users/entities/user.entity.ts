import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany,
    Index
  } from 'typeorm';
  import { ReadingInterval } from '../../reading-intervals/entities/reading-interval.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ 
      unique: true, 
      length: 50,
      comment: 'Unique username for the user' 
    })
    @Index({ unique: true })
    username: string;
  
    @Column({ 
      select: false, 
      comment: 'Hashed user password' 
    })
    password: string;
  
    @Column({ 
      type: 'enum', 
      enum: ['user', 'admin'], 
      default: 'user',
      comment: 'User role in the system' 
    })
    role: 'user' | 'admin';
  
    @Column({ 
      nullable: true,
      comment: 'User\'s display name' 
    })
    displayName?: string;
  
    @Column({ 
      nullable: true,
      comment: 'User\'s email address' 
    })
    email?: string;
  
    @CreateDateColumn({ 
      comment: 'Timestamp when the user account was created' 
    })
    createdAt: Date;
  
    @UpdateDateColumn({ 
      comment: 'Timestamp of the last user account update' 
    })
    updatedAt: Date;
  
    @Column({ 
      type: 'timestamp', 
      nullable: true,
      comment: 'Last login timestamp' 
    })
    lastLoginAt?: Date;
  
    @Column({ 
      default: true,
      comment: 'Account active status' 
    })
    isActive: boolean;
  
    // Relationships
    @OneToMany(() => ReadingInterval, readingInterval => readingInterval.user)
    readingIntervals: ReadingInterval[];
  
    // Method to check if user is an admin
    isAdmin(): boolean {
      return this.role === 'admin';
    }
  
    // Method to soft delete user account
    softDelete() {
      this.isActive = false;
    }
  
    // Method to update last login
    updateLastLogin() {
      this.lastLoginAt = new Date();
    }
  }