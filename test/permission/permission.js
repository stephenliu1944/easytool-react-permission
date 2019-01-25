import { permission } from '../../src/index';

it('permission', function () {
    var info = module1();
    expect(info).toMatchSnapshot();
});

