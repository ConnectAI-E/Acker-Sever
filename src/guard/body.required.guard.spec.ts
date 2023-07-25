import { BodyRequiredGuard } from './body.required.guard';

export class TestDto {
  nickName: string;
}

describe('BodyRequiredGuard', () => {
  it('should be defined', () => {
    expect(new BodyRequiredGuard(TestDto)).toBeDefined();
  });
});
