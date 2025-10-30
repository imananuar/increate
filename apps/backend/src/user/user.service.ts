import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: email },
      select: ['email', 'first_name', 'last_name', 'company_name' ,'company_street_addr', 'company_building_addr', 'company_postcode', 'company_city', 'company_country']
    });
    if (!user) {
      throw new NotFoundException(`${email} is not found!`);
    }
    return user;
  }

  updateUser(user: UserDto): boolean {
    try {
      this.userRepo.update({ email: user.email }, {
        first_name: user.first_name,
        last_name: user.last_name,
        company_name: user.company_name,
        company_street_addr: user.company_street_addr,
        company_building_addr: user.company_building_addr,
        company_city: user.company_city,
        company_postcode: user.company_postcode,
        company_country: user.company_country
      });

    } catch (err) {
      console.error("Error during update user in DB: ", err);
      return false;
    }

    return true;
  }
}
