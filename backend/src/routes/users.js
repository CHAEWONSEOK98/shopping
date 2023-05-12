const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/auth', auth, async (req, res, next) => {
  try {
    return res.json({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      image: req.user.image,
      cart: req.user.cart,
      history: req.user.history,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    // 존재하는 유저인지 체크
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send('Auth failed, email not found');
    }

    // 비밀번호 체크
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send('Wrong password');
    }

    const payload = {
      userId: user._id.toHexString(),
    };

    // token 생성
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ user, accessToken }); // >> userSlice > loginUser.fulfilled
  } catch (error) {
    next(error);
  }
});

router.post('/logout', auth, async (req, res, next) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post('/cart', auth, async (req, res, next) => {
  try {
    // 먼저 User Collection에 해당 유저의 정보를 가져오기
    const userInfo = await User.findOne({ _id: req.user._id });

    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });

    // 상품이 이미 있을 때
    if (duplicate) {
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, 'cart.id': req.body.productId },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true }
      );
      return res.status(201).send(user.cart);
    }

    // 상품이 이미 있지 않을 때
    else {
      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true }
      );

      return res.status(201).send(user.cart);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/cart', auth, async (req, res, next) => {
  try {
    // 먼저 cart안에 내가 지우려고 한 상품을 지워주기
    const userInfo = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { cart: { id: req.query.productId } },
      },
      { new: true }
    );

    const cart = userInfo.cart;
    const array = cart.map((item) => {
      return item.id;
    });

    // product collection에서 현재 남아있는 상품들의 정보를 가져오기
    // productIds = ['123141215947987891', '12314122146798'] 이런 식으로 바꿔주기
    const productInfo = await Product.find({ _id: { $in: array } }).populate(
      'writer'
    );

    return res.json({
      productInfo,
      cart,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
