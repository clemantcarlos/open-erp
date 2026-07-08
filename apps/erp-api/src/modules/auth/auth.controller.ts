import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// services
import { AuthService } from './auth.service';
// dto
import { AuthDto, CreateApiKeyDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/user.dto';
// guards
import { RtGuard } from './common/guards/rt.guard';
// decorators
import { GetCurrentUser } from './common/decorators/get-current-user.decorator';
import { Public } from './common/decorators/public.decorator';
// types
import { UserWithTokens } from './types/userWithTokens';
import { Tokens } from './types/tokens.type';
import { ResponseDto } from '@/interfaces/getResponse';
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  signupLocal(
    @Body() user: CreateUserDto,
  ): Promise<ResponseDto<UserWithTokens>> {
    return this.authService.signupLocal(user);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  signinLocal(@Body() dto: AuthDto): Promise<ResponseDto<UserWithTokens>> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out the current user' })
  logout(@GetCurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') rt: string,
  ): Promise<ResponseDto<Tokens>> {
    return this.authService.refreshTokens(userId, rt);
  }

  @Post('api-keys')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new API key' })
  createApiKey(
    @GetCurrentUser('sub') userId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.authService.createApiKey(userId, dto.name, dto.expiresAt);
  }

  @Get('api-keys')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all API keys for the current user' })
  getApiKeys(@GetCurrentUser('sub') userId: string) {
    return this.authService.getApiKeys(userId);
  }

  @Delete('api-keys/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke an API key' })
  revokeApiKey(
    @GetCurrentUser('sub') userId: string,
    @Param('id') keyId: string,
  ) {
    return this.authService.revokeApiKey(userId, keyId);
  }
}
