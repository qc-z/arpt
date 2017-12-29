'use strict'

const mongoose = require('mongoose')
// const User = mongoose.model('User')
const Client = mongoose.model('Client')
const Face = mongoose.model('Face')
const Skin = mongoose.model('Skin')
// const _ = require('lodash')
// const xss = require('xss')
// const sms = require('../service/sms')
const facepp = require('../service/facepp')
const config = require('../../config/config')
// const Msg = require('../libs/msg')

/**
 * @api {get} /lookTest 根据 uuid 或者 手机号码 获取颜值测试的值
 * @apiName getFaceTest
 * @apiGroup Face
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 打开用户 A 分享出来的连接，根据 uuid 或者 手机号码 获取颜值测试的值.
 *
 * @apiParam {String} uuid 分享连接里面的 uuid.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的颜值测试值.
 *
 * @apiExample Example usage:
 * http://10.0.0.116:4300/lookTest?uuid=1234&mobile=15501451077
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   looks   测试返回值.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 1
 *       "look": {
 *       "LooksTotalScore":91.2,
 *       "Face":Object{...},
 *       "Landmark":Object{...},
 *       "Image_path":null,
 *       "Ima_width":432,
 *       "Ima_height":432,
 *       "SKanXiang":Object{...},
 *       "KanXiangScore":89.7,
 *       "SOutLine":Object{...},
 *       "OutLineScore":86,
 *       "SEyebrow":Object{...},
 *       "EyebrowScore":96.5,
 *       "SEye":Object{...},
 *       "EyeScore":90.6,
 *       "SNose":Object{...},
 *       "NoseScore":92.8,
 *       "SMouth":Object{...},
 *       "MouthScore":94.6,
 *       "TestValue":Object{...},
 *			 "uuid": '123',
 *			 "shareUrl": 'http...'
 *     	}
 */
exports.getTest = function *(next) {
    let uuid = this.query.uuid || ''
    let mobile = this.query.mobile
    let clientId = this.query.clientId || ''

    if(!uuid && !mobile) {
        return (this.body = {code:0,err:'请求参数不能为空'})
    }

    let face = yield Face.findOne({uuid: uuid, clientId: clientId}).exec()

    if(!face) {
        return (this.body = {
            code: 0,
            err: '没有找到颜值测试数据'
        })
    }

    if(mobile) {
        let mFace = yield Face.findOne({mobile: mobile, clientId: clientId}).exec()
        if(mFace) {
            face = mFace
        }
    }

    let returnData = {
        LooksTotalScore: face.looksTotalScore,
        Face: face.face,
        Image_path: face.image_path,
        Ima_width: face.ima_width,
        Ima_height: face.ima_height,
        SKanXiang: face.sKanXiang,
        KanXiangScore: face.kanXiangScore,
        SOutLine: face.sOutLine,
        OutLineScore: face.outLineScore,
        SEyebrow: face.sEyebrow,
        EyebrowScore: face.eyebrowScore,
        SEye: face.sEye,
        EyeScore: face.eyeScore,
        SNose: face.sNose,
        NoseScore: face.noseScore,
        SMouth: face.sMouth,
        MouthScore: face.mouthScore,
        TestValue: face.testValue,
        uuid: face.uuid,
        shareUrl: face.shareUrl
    }

    return (this.body = {
        code: 1,
        looks: returnData
    })

}

/**
 * @api {post} /lookTest 根据 uuid 或者 手机号码 生成颜值测试的值
 * @apiName postFaceTest
 * @apiGroup Face
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 产生颜值测试的值.
 *
 * @apiParam {String} uuid 前端产品的一个随机字符串 uuid，来作为这个用户的唯一ID.
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的颜值测试值.
 * @apiParam {String} deviceId 可选参数，AR专用 后台用来判断这个设备是否有权限测试.
 * @apiParam {Object} data 用来包裹上面四个参数.
 * @apiParam {file} file 上传的图片，前端压缩后上传, 不得大于 2m.
 *
 * @apiExample Example usage:
 * http://10.0.0.116:4300/lookTest
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   looks   测试返回值.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 1
 *       "look": {
 *       "LooksTotalScore":91.2,
 *       "Face":Object{...},
 *       "Landmark":Object{...},
 *       "Image_path":null,
 *       "Ima_width":432,
 *       "Ima_height":432,
 *       "SKanXiang":Object{...},
 *       "KanXiangScore":89.7,
 *       "SOutLine":Object{...},
 *       "OutLineScore":86,
 *       "SEyebrow":Object{...},
 *       "EyebrowScore":96.5,
 *       "SEye":Object{...},
 *       "EyeScore":90.6,
 *       "SNose":Object{...},
 *       "NoseScore":92.8,
 *       "SMouth":Object{...},
 *       "MouthScore":94.6,
 *       "TestValue":Object{...},
 *           "uuid": '123',
 *           "shareUrl": 'http...'
 *      }
 */
exports.lookTest = function *(next) {
    console.log('@@@@', this.request.body)
    let body = this.request.body.fields.data
    if(!body) {
        return (this.body = {code:0,err:'传入参数有误'})
    }
    body = JSON.parse(body)
    let uuid = body.uuid || ''
    let clientId = body.clientId || ''
    let deviceId = body.deviceId
    let mobile = body.mobile || ''

    if(this.session.client && this.session.client.clientId) {
        clientId = this.session.client.clientId
    }

    if(!clientId) {
        return (this.body = {code:0,err:'clientId not found'})
    }

    if(!uuid) {
        uuid = Math.random().toString(36).substring(3, 11)
    }

    if(!this.request.body.files || !this.request.body.files.file || !this.request.body.files.file.path) {
        return (this.body = {code:0,err:'没有收到文件'})
    }

    let client = yield Client.findOne({_id: clientId}).exec()

    if(!client) {
        return (this.body = {
            code: 0,
            err: '客户不存在 请先登录'
        })
    }

    let faceRole = client.faceRole
    let toDate = faceRole.to
    let timeNow = new Date()
    timeNow = timeNow.getTime()

    if(!faceRole.role || (timeNow - toDate) > 0) {
        return (this.body = {
            code: 0,
            err: '没有使用权限'
        })
    }

    let oldFace = yield Face.findOne({clientId: clientId, uuid: uuid}).exec()
    if(mobile) {
        let mobileFace = yield Face.findOne({clientId: clientId, mobile: mobile}).exec()
        if(mobileFace) {
            oldFace = mobileFace
        }
    }

    if(deviceId) {

        let shareUrl = config.reportFaceUrl + '?uuid=' + uuid + '&clientId=' + clientId

        if(!this.session.client) {
          return (this.body = {
            code: 0,
            err: '请先登录'
          })
        }

        if(client.deviceId.length > 0 && client.deviceId.indexOf(deviceId) === -1 &&  client.deviceLimit === client.deviceId.length) {
            return (this.body = {
                code: 0,
                err: '设备已经超过使用次数'
            })
        }

        if (client.deviceId.indexOf(deviceId) === -1) {
            client.deviceId.push(deviceId)
            yield client.save()
        }

        try {
            yield facepp.gm(this.request.body.files.file.path)
        } catch(catchErr) {
            console.log('catchErr', catchErr)
        }

        let facedata = yield facepp.detect({
            file: this.request.body.files.file
        })

        if(!facedata) {
            return (this.body = {code:0,err:'颜值测试异常'})
        }

        let _face = facepp.findBigestFace(facedata.faces)
        // let _face = facedata.faces[0]

        if(!_face) {
          return (this.body = {
            code: 0,
            err: '人脸识别失败'
          })
        }

        // adaptive old skin old Api
        _face.attribute=_face.attributes
        _face.attribute.smiling=_face.attribute.smile
        _face.face_id = _face.face_token

        let looks = yield facepp.cloudtest(_face)

        if (oldFace) {
            if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
              this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
            }

            looks.Image_path = this.request.body.files.file.path

            oldFace.looksTotalScore = looks.LooksTotalScore //面容总分
            oldFace.face = looks.Face  // face++原始数据
            oldFace.image_path = this.request.body.files.file.path // 图片路径
            oldFace.ima_width = looks.Ima_width// 对应图像宽度
            oldFace.ima_height = looks.Ima_height // 对应图像高度
            oldFace.sKanXiang = looks.SKanXiang // 看相参数（对象，包含其他字段，详细看TestValue）
            oldFace.kanXiangScore = looks.KanXiangScore // 看相分数
            oldFace.sOutLine = looks.SOutLine // 轮廓参数（对象，包含其他字段，详细看TestValue）
            oldFace.outLineScore = looks.OutLineScore // 轮廓评分
            oldFace.sEyebrow = looks.SEyebrow // 眉参数（对象，包含其他字段，详细看TestValue
            oldFace.eyebrowScore = looks.EyebrowScore // 眉评分（对象，包含其他字段，详细看TestValue
            oldFace.sEye = looks.SEye // 眼参数（对象，包含其他字段，详细看TestValue）
            oldFace.eyeScore = looks.EyeScore // 眼评分
            oldFace.sNose = looks.SNose // 鼻参数（对象，包含其他字段，详细看TestValue）
            oldFace.noseScore = looks.NoseScore // 鼻评分
            oldFace.sMouth = looks.SMouth // 口参数（对象，包含其他字段，详细看TestValue
            oldFace.mouthScore = looks.MouthScore // 口评分
            oldFace.testValue = looks.TestValue // 面部测试数据
            oldFace.originType = 'AR' // 面部测试数据
            oldFace.testTimes = oldFace.testTimes + 1

            if(mobile) {
                oldFace.mobile = mobile
            }

            yield oldFace.save()

            return (this.body = {
              code: 1,
              looks: looks,
              uuid:oldFace.uuid,
              clientId:clientId,
              shareUrl: oldFace.shareUrl
            })

        } else {

            if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
              this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
            }
            looks.Image_path = this.request.body.files.file.path

            let faceSave = new Face({
                looksTotalScore: looks.LooksTotalScore, //面容总分
                face: looks.Face, // face++原始数据
                image_path: this.request.body.files.file.path, // 图片路径
                ima_width: looks.Ima_width,// 对应图像宽度
                ima_height: looks.Ima_height, // 对应图像高度
                sKanXiang: looks.SKanXiang, // 看相参数（对象，包含其他字段，详细看TestValue）
                kanXiangScore: looks.KanXiangScore, // 看相分数
                sOutLine: looks.SOutLine, // 轮廓参数（对象，包含其他字段，详细看TestValue）
                outLineScore: looks.OutLineScore, // 轮廓评分
                sEyebrow: looks.SEyebrow, // 眉参数（对象，包含其他字段，详细看TestValue
                eyebrowScore: looks.EyebrowScore, // 眉评分（对象，包含其他字段，详细看TestValue
                sEye: looks.SEye, // 眼参数（对象，包含其他字段，详细看TestValue）
                eyeScore: looks.EyeScore, // 眼评分
                sNose: looks.SNose, // 鼻参数（对象，包含其他字段，详细看TestValue）
                noseScore: looks.NoseScore, // 鼻评分
                sMouth: looks.SMouth, // 口参数（对象，包含其他字段，详细看TestValue
                mouthScore: looks.MouthScore, // 口评分
                testValue: looks.TestValue, // 面部测试数据
                originType: 'AR',
                uuid: uuid,
                shareUrl: shareUrl,
                clientId: clientId
            })

            if(mobile) {
                faceSave.mobile = mobile
            }

            yield faceSave.save()



            return (this.body = {
                code: 1,
                looks: looks,
                uuid:uuid,
                clientId:clientId,
                shareUrl: shareUrl
            })
        }
    }else {        
        try {
            yield facepp.gm(this.request.body.files.file.path)
        } catch(catchErr) {
            console.log('catchErr', catchErr)
        }
        let facedata = yield facepp.detect({
            file: this.request.body.files.file
        })
        if(!facedata) {
            return (this.body = {code:0,err:'颜值测试异常'})
        }

        let _face = facepp.findBigestFace(facedata.faces)
        // let _face = facedata.faces[0]
        if(!_face) {
          return (this.body = {
            code: 0,
            err: '人脸识别失败'
          })
        }

        // adaptive old skin old Api
        _face.attribute=_face.attributes
        _face.attribute.smiling=_face.attribute.smile
        _face.face_id = _face.face_token

        let looks = yield facepp.cloudtest(_face)

        if (oldFace) {

            if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
              this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
            }
            looks.Image_path = this.request.body.files.file.path

            oldFace.looksTotalScore = looks.LooksTotalScore //面容总分
            oldFace.face = looks.Face  // face++原始数据
            oldFace.image_path = this.request.body.files.file.path // 图片路径
            oldFace.ima_width = looks.Ima_width// 对应图像宽度
            oldFace.ima_height = looks.Ima_height // 对应图像高度
            oldFace.sKanXiang = looks.SKanXiang // 看相参数（对象，包含其他字段，详细看TestValue）
            oldFace.kanXiangScore = looks.KanXiangScore // 看相分数
            oldFace.sOutLine = looks.SOutLine // 轮廓参数（对象，包含其他字段，详细看TestValue）
            oldFace.outLineScore = looks.OutLineScore // 轮廓评分
            oldFace.sEyebrow = looks.SEyebrow // 眉参数（对象，包含其他字段，详细看TestValue
            oldFace.eyebrowScore = looks.EyebrowScore // 眉评分（对象，包含其他字段，详细看TestValue
            oldFace.sEye = looks.SEye // 眼参数（对象，包含其他字段，详细看TestValue）
            oldFace.eyeScore = looks.EyeScore // 眼评分
            oldFace.sNose = looks.SNose // 鼻参数（对象，包含其他字段，详细看TestValue）
            oldFace.noseScore = looks.NoseScore // 鼻评分
            oldFace.sMouth = looks.SMouth // 口参数（对象，包含其他字段，详细看TestValue
            oldFace.mouthScore = looks.MouthScore // 口评分
            oldFace.testValue = looks.TestValue // 面部测试数据
            oldFace.originType = 'MO' // 面部测试数据
            oldFace.testTimes = oldFace.testTimes + 1

            yield oldFace.save()

            return (this.body = {
              code: 1,
              uuid: oldFace.uuid,
              shareUrl: oldFace.shareUrl,
              clientId: clientId,
              looks: looks
            })
        } else {

            if (this.request.body.files && this.request.body.files.file && this.request.body.files.file.path) {
              this.request.body.files.file.path = this.request.body.files.file.path.split('public/')[1]
            }
            looks.Image_path = this.request.body.files.file.path
            let shareUrl = config.reportFaceUrl + '?uuid=' + uuid + '&clientId=' + clientId
            let faceSave = new Face({
                looksTotalScore: looks.LooksTotalScore, //面容总分
                face: looks.Face, // face++原始数据
                image_path: this.request.body.files.file.path, // 图片路径
                ima_width: looks.Ima_width,// 对应图像宽度
                ima_height: looks.Ima_height, // 对应图像高度
                sKanXiang: looks.SKanXiang, // 看相参数（对象，包含其他字段，详细看TestValue）
                kanXiangScore: looks.KanXiangScore, // 看相分数
                sOutLine: looks.SOutLine, // 轮廓参数（对象，包含其他字段，详细看TestValue）
                outLineScore: looks.OutLineScore, // 轮廓评分
                sEyebrow: looks.SEyebrow, // 眉参数（对象，包含其他字段，详细看TestValue
                eyebrowScore: looks.EyebrowScore, // 眉评分（对象，包含其他字段，详细看TestValue
                sEye: looks.SEye, // 眼参数（对象，包含其他字段，详细看TestValue）
                eyeScore: looks.EyeScore, // 眼评分
                sNose: looks.SNose, // 鼻参数（对象，包含其他字段，详细看TestValue）
                noseScore: looks.NoseScore, // 鼻评分
                sMouth: looks.SMouth, // 口参数（对象，包含其他字段，详细看TestValue
                mouthScore: looks.MouthScore, // 口评分
                testValue: looks.TestValue, // 面部测试数据
                originType: 'MO',
                uuid: uuid,
                shareUrl: shareUrl,
                clientId: clientId
            })
            yield faceSave.save()

            return (this.body = {
                code: 1,
                looks: looks,
                uuid: uuid,
                clientId: clientId,
                shareUrl: shareUrl
            })
        }
    }
}


/**
 * @api {post} /lookTestUrl 根据 uuid 或者 手机号码 和 阿里云图片 url生成颜值测试的值
 * @apiName postFaceTest
 * @apiGroup Face
 * @apiPermission anyBody
 *
 * @apiDescription 在用户 B 根据 uuid 或者 手机号码 产生颜值测试的值.
 *
 * @apiParam {String} uuid 前端产品的一个随机字符串 uuid，来作为这个用户的唯一ID.
 * @apiParam {String} clientId 美容院或者分享连接里面的 clientId.
 * @apiParam {String} mobile 可选参数，AR 后台用来获取某个用户的颜值测试值.
 * @apiParam {String} deviceId 可选参数，AR专用 后台用来判断这个设备是否有权限测试.
 * @apiParam {String} file 阿里云图片路径.
 *
 * @apiExample Example usage:
 * http://10.0.0.116:4300/lookTest
 *
 * @apiSuccess {Number}   code   1 代表成功，0 代表失败.
 * @apiSuccess {Object}   looks   测试返回值.
 *
 * @apiError code 0.
 * @apiError err   err message.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 200 Ok
 *     {
 *       "code": 1
 *       "look": {
 *       "LooksTotalScore":91.2,
 *       "Face":Object{...},
 *       "Landmark":Object{...},
 *       "Image_path":null,
 *       "Ima_width":432,
 *       "Ima_height":432,
 *       "SKanXiang":Object{...},
 *       "KanXiangScore":89.7,
 *       "SOutLine":Object{...},
 *       "OutLineScore":86,
 *       "SEyebrow":Object{...},
 *       "EyebrowScore":96.5,
 *       "SEye":Object{...},
 *       "EyeScore":90.6,
 *       "SNose":Object{...},
 *       "NoseScore":92.8,
 *       "SMouth":Object{...},
 *       "MouthScore":94.6,
 *       "TestValue":Object{...},
 *			 "uuid": '123',
 *			 "shareUrl": 'http...'
 *     	}
 */

exports.lookTestUrl = function *(next) {
    console.log('@@@@', this.request.body)
    let body = this.request.body
    let uuid = body.uuid || ''
    let clientId = body.clientId || ''
    let deviceId = body.deviceId
    let mobile = body.mobile || ''
    let imgUrl = body.file

    if(this.session.client && this.session.client.clientId) {
        clientId = this.session.client.clientId
    }

    if(!clientId) {
        return (this.body = {code:0,err:'clientId not found'})
    }

    if(!uuid) {
        uuid = Math.random().toString(36).substring(3, 11)
    }

    if(!imgUrl) {
        return (this.body = {code:0,err:'没有收到文件'})
    } else {
        imgUrl = config.aliyun.ossHost + '/' + imgUrl
    }
    console.log(imgUrl)

    let client = yield Client.findOne({_id: clientId}).exec()

    if(!client) {
        return (this.body = {
            code: 0,
            err: '客户不存在 请先登录'
        })
    }

    let faceRole = client.faceRole
    let toDate = faceRole.to
    let timeNow = new Date()
    timeNow = timeNow.getTime()

    if(!faceRole.role || (timeNow - toDate) > 0) {
        return (this.body = {
            code: 0,
            err: '没有使用权限'
        })
    }

    let oldFace = yield Face.findOne({clientId: clientId, uuid: uuid}).exec()
    if(mobile) {
        let mobileFace = yield Face.findOne({clientId: clientId, mobile: mobile}).exec()
        if(mobileFace) {
            oldFace = mobileFace
        }
    }

    if(deviceId) {

        let shareUrl = config.reportFaceUrl + '?uuid=' + uuid + '&clientId=' + clientId

        if(!this.session.client) {
          return (this.body = {
            code: 0,
            err: '请先登录'
          })
        }

        if(client.deviceId.length > 0 && client.deviceId.indexOf(deviceId) === -1 &&  client.deviceLimit === client.deviceId.length) {
            return (this.body = {
                code: 0,
                err: '设备已经超过使用次数'
            })
        }

        if (client.deviceId.indexOf(deviceId) === -1) {
            client.deviceId.push(deviceId)
            yield client.save()
        }

        // try {
        //     yield facepp.gm(this.request.body.files.file.path)
        // } catch(catchErr) {
        //     console.log('catchErr', catchErr)
        // }

        let facedata = yield facepp.detectUrl(imgUrl)

        if(!facedata) {
            return (this.body = {code:0,err:'颜值测试异常'})
        }

        let _face = facepp.findBigestFace(facedata.faces)
        // let _face = facedata.faces[0]

        if(!_face) {
          return (this.body = {
            code: 0,
            err: '人脸识别失败'
          })
        }

        // adaptive old skin old Api
        _face.attribute=_face.attributes
        _face.attribute.smiling=_face.attribute.smile
        _face.face_id = _face.face_token

        let looks = yield facepp.cloudtest(_face)

        if (oldFace) {
            looks.Image_path = imgUrl

            oldFace.looksTotalScore = looks.LooksTotalScore //面容总分
            oldFace.face = looks.Face  // face++原始数据
            oldFace.image_path = imgUrl // 图片路径
            oldFace.ima_width = looks.Ima_width// 对应图像宽度
            oldFace.ima_height = looks.Ima_height // 对应图像高度
            oldFace.sKanXiang = looks.SKanXiang // 看相参数（对象，包含其他字段，详细看TestValue）
            oldFace.kanXiangScore = looks.KanXiangScore // 看相分数
            oldFace.sOutLine = looks.SOutLine // 轮廓参数（对象，包含其他字段，详细看TestValue）
            oldFace.outLineScore = looks.OutLineScore // 轮廓评分
            oldFace.sEyebrow = looks.SEyebrow // 眉参数（对象，包含其他字段，详细看TestValue
            oldFace.eyebrowScore = looks.EyebrowScore // 眉评分（对象，包含其他字段，详细看TestValue
            oldFace.sEye = looks.SEye // 眼参数（对象，包含其他字段，详细看TestValue）
            oldFace.eyeScore = looks.EyeScore // 眼评分
            oldFace.sNose = looks.SNose // 鼻参数（对象，包含其他字段，详细看TestValue）
            oldFace.noseScore = looks.NoseScore // 鼻评分
            oldFace.sMouth = looks.SMouth // 口参数（对象，包含其他字段，详细看TestValue
            oldFace.mouthScore = looks.MouthScore // 口评分
            oldFace.testValue = looks.TestValue // 面部测试数据
            oldFace.originType = 'AR' // 面部测试数据
            oldFace.testTimes = oldFace.testTimes + 1

            if(mobile) {
                oldFace.mobile = mobile
            }

            yield oldFace.save()

            return (this.body = {
              code: 1,
              looks: looks,
              uuid:oldFace.uuid,
              clientId:clientId,
              shareUrl: oldFace.shareUrl
            })

        } else {

            looks.Image_path = imgUrl

            let faceSave = new Face({
                looksTotalScore: looks.LooksTotalScore, //面容总分
                face: looks.Face, // face++原始数据
                image_path: imgUrl, // 图片路径
                ima_width: looks.Ima_width,// 对应图像宽度
                ima_height: looks.Ima_height, // 对应图像高度
                sKanXiang: looks.SKanXiang, // 看相参数（对象，包含其他字段，详细看TestValue）
                kanXiangScore: looks.KanXiangScore, // 看相分数
                sOutLine: looks.SOutLine, // 轮廓参数（对象，包含其他字段，详细看TestValue）
                outLineScore: looks.OutLineScore, // 轮廓评分
                sEyebrow: looks.SEyebrow, // 眉参数（对象，包含其他字段，详细看TestValue
                eyebrowScore: looks.EyebrowScore, // 眉评分（对象，包含其他字段，详细看TestValue
                sEye: looks.SEye, // 眼参数（对象，包含其他字段，详细看TestValue）
                eyeScore: looks.EyeScore, // 眼评分
                sNose: looks.SNose, // 鼻参数（对象，包含其他字段，详细看TestValue）
                noseScore: looks.NoseScore, // 鼻评分
                sMouth: looks.SMouth, // 口参数（对象，包含其他字段，详细看TestValue
                mouthScore: looks.MouthScore, // 口评分
                testValue: looks.TestValue, // 面部测试数据
                originType: 'AR',
                uuid: uuid,
                shareUrl: shareUrl,
                clientId: clientId
            })

            if(mobile) {
                faceSave.mobile = mobile
            }

            yield faceSave.save()



            return (this.body = {
                code: 1,
                looks: looks,
                uuid:uuid,
                clientId:clientId,
                shareUrl: shareUrl
            })
        }
    }else {        
        // try {
        //     yield facepp.gm(this.request.body.files.file.path)
        // } catch(catchErr) {
        //     console.log('catchErr', catchErr)
        // }
        let facedata = yield facepp.detectUrl(imgUrl)
        if(!facedata) {
            return (this.body = {code:0,err:'颜值测试异常'})
        }

        let _face = facepp.findBigestFace(facedata.faces)
        // let _face = facedata.faces[0]
        if(!_face) {
          return (this.body = {
            code: 0,
            err: '人脸识别失败'
          })
        }

        // adaptive old skin old Api
        _face.attribute=_face.attributes
        _face.attribute.smiling=_face.attribute.smile
        _face.face_id = _face.face_token

        let looks = yield facepp.cloudtest(_face)

        if (oldFace) {
            looks.Image_path = imgUrl

            oldFace.looksTotalScore = looks.LooksTotalScore //面容总分
            oldFace.face = looks.Face  // face++原始数据
            oldFace.image_path = imgUrl // 图片路径
            oldFace.ima_width = looks.Ima_width// 对应图像宽度
            oldFace.ima_height = looks.Ima_height // 对应图像高度
            oldFace.sKanXiang = looks.SKanXiang // 看相参数（对象，包含其他字段，详细看TestValue）
            oldFace.kanXiangScore = looks.KanXiangScore // 看相分数
            oldFace.sOutLine = looks.SOutLine // 轮廓参数（对象，包含其他字段，详细看TestValue）
            oldFace.outLineScore = looks.OutLineScore // 轮廓评分
            oldFace.sEyebrow = looks.SEyebrow // 眉参数（对象，包含其他字段，详细看TestValue
            oldFace.eyebrowScore = looks.EyebrowScore // 眉评分（对象，包含其他字段，详细看TestValue
            oldFace.sEye = looks.SEye // 眼参数（对象，包含其他字段，详细看TestValue）
            oldFace.eyeScore = looks.EyeScore // 眼评分
            oldFace.sNose = looks.SNose // 鼻参数（对象，包含其他字段，详细看TestValue）
            oldFace.noseScore = looks.NoseScore // 鼻评分
            oldFace.sMouth = looks.SMouth // 口参数（对象，包含其他字段，详细看TestValue
            oldFace.mouthScore = looks.MouthScore // 口评分
            oldFace.testValue = looks.TestValue // 面部测试数据
            oldFace.originType = 'MO' // 面部测试数据
            oldFace.testTimes = oldFace.testTimes + 1

            yield oldFace.save()

            return (this.body = {
              code: 1,
              uuid: oldFace.uuid,
              shareUrl: oldFace.shareUrl,
              clientId: clientId,
              looks: looks
            })
        } else {

            looks.Image_path = imgUrl
            let shareUrl = config.reportFaceUrl + '?uuid=' + uuid + '&clientId=' + clientId
            let faceSave = new Face({
                looksTotalScore: looks.LooksTotalScore, //面容总分
                face: looks.Face, // face++原始数据
                image_path: imgUrl, // 图片路径
                ima_width: looks.Ima_width,// 对应图像宽度
                ima_height: looks.Ima_height, // 对应图像高度
                sKanXiang: looks.SKanXiang, // 看相参数（对象，包含其他字段，详细看TestValue）
                kanXiangScore: looks.KanXiangScore, // 看相分数
                sOutLine: looks.SOutLine, // 轮廓参数（对象，包含其他字段，详细看TestValue）
                outLineScore: looks.OutLineScore, // 轮廓评分
                sEyebrow: looks.SEyebrow, // 眉参数（对象，包含其他字段，详细看TestValue
                eyebrowScore: looks.EyebrowScore, // 眉评分（对象，包含其他字段，详细看TestValue
                sEye: looks.SEye, // 眼参数（对象，包含其他字段，详细看TestValue）
                eyeScore: looks.EyeScore, // 眼评分
                sNose: looks.SNose, // 鼻参数（对象，包含其他字段，详细看TestValue）
                noseScore: looks.NoseScore, // 鼻评分
                sMouth: looks.SMouth, // 口参数（对象，包含其他字段，详细看TestValue
                mouthScore: looks.MouthScore, // 口评分
                testValue: looks.TestValue, // 面部测试数据
                originType: 'MO',
                uuid: uuid,
                shareUrl: shareUrl,
                clientId: clientId
            })
            yield faceSave.save()

            return (this.body = {
                code: 1,
                looks: looks,
                uuid: uuid,
                clientId: clientId,
                shareUrl: shareUrl
            })
        }
    }
}

exports.getFace = function *(next) {

    function findBigestFace(faces) {
        var face
        for(var i in faces)
        {
            if(face==null)
            {
                face=faces[i]
            }
            else
            {
                if(faces[i].face_rectangle.width>=face.face_rectangle.width&&faces[i].face_rectangle.height>=face.face_rectangle.height)
                {
                    face=faces[i]
                }
            }
        }
        return face
    }

    // var body = this.request.body

    // const existUser = yield User.findOne({mobile:body.mobile}).exec()

    // if(!existUser) {
    // 	return (this.body = {code:0,err:'用户信息没有找到'})
    // }

    if(!this.request.body.files) {
        return (this.body = {code:0,err:'没有受到文件'})
    }
    
    try {
        yield facepp.gm(this.request.body.files.file.path)
    } catch(catchErr) {
        console.log('catchErr', catchErr)
    }
    const facedata = yield facepp.detect(imgUrl)

    if(!facedata) {
        return (this.body = {code:0,err:'颜值测试异常'})
    }


    const _face = yield findBigestFace(facedata.faces)

    // adaptive old skin old Api
    _face.attribute=_face.attributes
    _face.attribute.smiling=_face.attribute.smile
    _face.face_id = _face.face_token

    const skin = yield facepp.skincloudtest({
        file: this.request.body.files.file
    })

    const looks = yield facepp.cloudtest(_face)

    const faceSave = new Face({
        looksTotalScore: looks.LooksTotalScore, //面容总分
        face: looks.Face, // face++原始数据
        image_path: looks.Image_path, // 图片路径
        ima_width: looks.Ima_width,// 对应图像宽度
        ima_height: looks.Ima_height, // 对应图像高度
        sKanXiang: looks.SKanXiang, // 看相参数（对象，包含其他字段，详细看TestValue）
        kanXiangScore: looks.KanXiangScore, // 看相分数
        sOutLine: looks.SOutLine, // 轮廓参数（对象，包含其他字段，详细看TestValue）
        outLineScore: looks.OutLineScore, // 轮廓评分
        sEyebrow: looks.SEyebrow, // 眉参数（对象，包含其他字段，详细看TestValue
        EyebrowScore: looks.EyebrowScore, // 眉评分（对象，包含其他字段，详细看TestValue
        sEye: looks.SEye, // 眼参数（对象，包含其他字段，详细看TestValue）
        eyeScore: looks.EyeScore, // 眼评分
        sNose: looks.SNose, // 鼻参数（对象，包含其他字段，详细看TestValue）
        noseScore: looks.NoseScore, // 鼻评分
        sMouth: looks.SMouth, // 口参数（对象，包含其他字段，详细看TestValue
        mouthScore: looks.MouthScore, // 口评分
        testValue: looks.TestValue // 面部测试数据
    })

    yield faceSave.save()

    const skinSave = new Skin({
        water_flag: skin.WATER_FLAG, // 水分0
        inflammation_flag: skin.INFLAMMATION_FLAG, // 炎症（无、轻微、中、严重）数组对象
        wrinkles_flag: skin.WRINKLES_FLAG, // 皱纹（鱼尾纹、法令纹、川字纹）数组对象
        color_flag: skin.COLOR_FLAG, // 肤色0
        oil_flag: skin.OIL_FLAG, // 油份0
        prose_flag: skin.PROSE_FLAG // 毛孔（小，中，大）数组对象
    })

    yield skinSave.save()

    this.body = {
        code:1,
        looks: looks,
        skin: skin
    }

}

