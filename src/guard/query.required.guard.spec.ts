import { QueryRequiredGuard } from './query.required.guard';

export class TestDto {
  nickName: string;
}

describe('QueryRequiredGuard', () => {
  it('should be defined', () => {
    expect(new QueryRequiredGuard(TestDto)).toBeDefined();
  });
});
