var project_config = require('../../../projectConfig.js');
var Host = module.exports = {}

/**
 * @description 接口服务器地址
 */
Host.add_rort = project_config.add_rort;

/**
 * 项目根路径
 */
Host.root = project_config.root;

/**
 * @description 登录模块
 */
Host.login = {
    // 登录
    login: "Admin/Login/UserLogin",
    // 获取公钥
    get_publick_key: "Login/GetPublicKey",
    // 超级管理员修改密码:UpdateUserPassword(int adminid, string oldpwd, string newpwd)  超级管理员Id,旧密码,新密码
    modify_admin_password: 'Admin/UpdateUserPassword'
}
Host.developer = {

}

/**
 * 首页管理
 */
Host.home = {
    // 轮播图管理
    banner: {
        // 添加轮播图:CarouselImgAdd(string name, string description, int imgid ,string richtext)   新增:richtext   富文本
        add: 'Admin/CarouselImgAdd',
        // 修改轮播图:CarouselImgUpdate(string name, string description, int id, int imgid , string richtext)
        modify: 'Admin/CarouselImgUpdate',
        delete: 'Admin/CarouselImgDel',
        list: 'Admin/CarouselImgQuey',
        get: ''
    },
    // 视频管理
    video: {
        add: 'Admin/CarouselVideoAdd', // (string name, string description, int imgid,int videoid)  标题，描述，视频图片id，视频id
        modify: 'Admin/CarouselVideoUpdate', // (string name, string description, int id, int imgid,int videoid) 标题，描述，视频id，视频图片id，视频资源id
        delete: 'Admin/CarouselVideoDel',
        list: 'Admin/CarouselVideoQuey',
        get: ''
    },
    title: {
        // 获取首页标题信息:GetIndexInfo()
        get: 'Index/GetIndexInfo',
        // 修改首页标题信息:UpdateIndexInfo(string titleup, string titledown,string middleup,string middledown,string videoup,string videodown)  标题上,标题下,中部上,中部下,视频上,视频下
        modify: 'Index/UpdateIndexInfo'
    }
}

/**
 * 课程管理
 */
Host.course = {
    // 成语管理
    phrase: {
        // 添加成语：PhraseAdd(string phrase,int[] recordingid, int courseid) 成语，成语语音id字符串，课程id
        add: 'Admin/PhraseAdd',
        // 修改成语：PhraseUpdate(int id, string phrase, int[] recordingid, int courseid) 成语id，成语，成语语音id字符串，课程id
        modify: 'Admin/PhraseUpdate',
        // 删除成语：PhraseDel(int id) 成语id
        delete: 'Admin/PhraseDel',
        // 查询全部成语： PhraseQuey(DataTablesParameters dps)
        list: 'Admin/PhraseQuey',
        // 根据阶段id取课次(成语版)：GetPhraseCourse(int courseid) 阶段id
        get_section_by_stage: 'Admin/GetPhraseCourseById'
    },
    // 阶段管理
    stage: {
        // CourseAdd(string describe,int sortcode) 描述，课次排序码
        add: 'Admin/CourseAdd',
        // 修改课程：CourseUpdate(int id,string describe,int sortcode) 课程id，描述，课程排序码
        modify: 'Admin/CourseUpdate',
        // 删除课程：CourseDel(int id)  课程id
        delete: 'Admin/CourseDel',
        // 查询全部课程：CourseQuey(DataTablesParameters dps)
        list: 'Admin/CourseQuey',
        get: '',
        // 获得所有阶段
        all: 'Admin/CourseShow',
        // 获取阶段最大排序值：GetStageRank()
        get_last_index: 'Admin/GetStageRank'
    },
    // 课次管理
    section: {
        // 添加阶段课次：ModuleAdd(string describe,int coursemakeid,int modules,bool isbegin,bool iscircle, string description,bool isflash)  描述，课程id，当前课次，课次是否可用,贴图是否画圆，课次内容,是否闪卡
        add: 'Admin/ModuleAdd',
        // 修改课次： ModuleUpdate(int id,string describe, int coursemakeid, int modules,bool isbegin, bool iscircle, string description,bool isflash)id，描述，课程id，当前课次，是否开始,贴图是否画圆，课次内容	,是否闪卡	
        modify: 'Admin/ModuleUpdate',
        // 删除课次：ModuleDel(int id)  课次id
        delete: 'Admin/ModuleDel',
        // 查询全部课次：ModuleQuey(DataTablesParameters dps)
        list: 'Admin/ModuleQuey',
        get: '',
        // 根据阶段id获得课次： ModuleByCouresid(int id)  阶段id
        get_section_by_stage_id: 'Admin/ModuleByCouresid',
        // 获取当前阶段课程排序最大值：GetCourseRank(int stageid) 阶段id
        get_last_index: 'Admin/GetCourseRank',

    },
    // 课次管理
    record: {
        // 添加录音：RecordAdd(int courseid, int frontclassid, int phrasecardid, int phrasethiefid, int puzzleid, int stimulateid,int articlelront,int articlelater)  课次id，课前规范录音id，成语闪卡录音id，成语捉小偷录音id，拼图前录音id，激励录音id，作文上传前录音id，作文上传后录音id
        add: 'Admin/RecordAdd',
        // 修改录音：RecordUpdate(int id,int courseid, int frontclassid, int phrasecardid, int phrasethiefid, int puzzleid, int stimulateid)录音id，课次id，课前规范，成语闪卡，成语捉小偷，拼图前，拼图激励
        modify: 'Admin/RecordUpdate',
        // 删除录音：RecordDel(int id) 录音id
        delete: 'Admin/RecordDel',
        // 查询全部录音：RecordQuey(DataTablesParameters dps)
        list: 'Admin/RecordQuey',
        get: '',
        // 根据课次id查询录音：RecordQueyByCId(int courseid) 课次id
        get_record_by_section_id: 'Admin/RecordQueyByCId'
    },
    setting: {
        // 添加分数与速度设置： SettingAdd( int thiefgrade, int thiefsepeed, int thiefrepeatedly, int flashgrade, int flashsepeed, int flashrepeatedly, string puzzleduration, int puzzlegtade, int artidegtade, string artideduration, int stimulategrade)成语小偷分数，成语小偷速度，成语小偷次数，闪卡分数，闪卡速度，闪卡频率，拼图分数，拼图时长，上传作文分数，上传作文时长，写作激励分数
        add: 'Admin/SettingAdd',
        // 修改分数与速度设置：SettingUpdate(int id, int thiefgrade, int thiefsepeed, int thiefrepeatedly, int flashgrade, int flashsepeed, int flashrepeatedly, string puzzleduration, int puzzlegtade, int artidegtade, string artideduration, int stimulategrade)成语小偷分数，成语小偷速度，成语小偷次数，闪卡分数，闪卡速度，闪卡频率，拼图分数，拼图时长，上传作文分数，上传作文时长，写作激励分数
        modify: 'Admin/SettingUpdate',
        // 删除分数与速度设置：SettingDel(int id) 分数与速度设置id
        delete: 'Admin/SettingDel',
        // 查询全部分数与速度设置： SettingQuey()
        list: 'Admin/SettingQuey',
        // 获取课程的全局设置 GetSetting()  
        get: 'Admin/GetSetting'
    }
}

/**
 * 资源管理
 */
Host.resource = {
    upload_file: 'Admin/UploadFill'
}

Host.student = {
    // 百分榜
    high_mark: {
        // 学生上传百分版：UploadHundred(int studentid, string headline, int[] imgid, string addresscapital, string addressdistrict, string grade)  学生Id，文章标题，图片资源id数组，省市，地区，年级
        add: 'Student/UploadHundred',
        // 学生查看百分榜：HundredShow(DataTablesParameters dps, int studentid)  ，学生id
        list_self: 'Student/HundredShow',
        // 百分榜通过：HundredYes(int hundredid) 作文id
        pass: 'Admin/HundredYes',
        // 百分榜未通过：HundredNo(int hundredid) 作文id
        refuse: 'Admin/HundredNo',
        // 未审核百分榜作文： HundredNoAudit(DataTablesParameters dps)
        list_check: 'Admin/HundredNoAudit',
        // 显示审核通过百分版:HundredYesAudit(DataTablesParameters dps)
        list_passed: 'Admin/HundredYesAudit',
        // 显示所有百分榜作文：HundredQuey(DataTablesParameters dps)
        // 后台删除审核通过百分榜作文：HundredDel(int hundredid, int studentid)  作文Id，学生Id
        delete_passed: 'Admin/HundredDel',
        list_all: 'Admin/HundredQuey',
        
    },
    // 拼图
    jigsaw: {
        // 添加拼图：PuzzleAdd(int studentid,int courseid,int imgid) 学生id，课次id，拼图资源id
        add: 'Student/PuzzleAdd',
        // 获取全部拼图：GetPuzzle(DataTablesParameters dps) 
        list_all: 'Admin/GetPuzzle'
    },
    // 作文
    composition: {
        // 添加作文：ArticleAdd(int studentid, int courseid, int imgid) 学生id，课次id，作文图片id
        add: 'Student/ArticleAdd',
        // 获取全部作文：GetArticle(DataTablesParameters dps)
        list_all: 'Admin/GetArticle',
        // 根据作文id查询作文批改详情:GetArticleCorrect(int articleid,int correctid)  作文id,批改者id
        commented_image: 'Admin/GetArticleCorrectById'
    },
    // 获取全部成长记录：GetGrowthQuey(DataTablesParameters dps)
    study_record_all: 'Admin/GetGrowthQuey',
    // 查询所有学生
    list_all: 'Admin/GetStedentQuey',
    // 学生修改课时:UpdateHour(int studentid, int hour) 学生Id,课时
    modify_hour: 'Admin/UpdateStudentHour',

    // 删除学生：DelStudent(int studentId) 学生id
    delect:"Admin/DelStudent",
}

// 教师管理
Host.teacher = {
    template: {
        // 上传模板：TemplateUpload(int[] id,string Description)   模板id数组，模板描述
        add: 'Admin/TemplateUpload',
        // 获取模板列表：TemplateQuey()
        list: 'Admin/TemplateQuey',
        // 修改模板：TemplateUpdate(int templateid,int[] imgid, string Description)  模板id，模板图片，文本
        modify: 'Admin/TemplateUpdate'
    },
    // 获得所有未审核教师列表： EvaluationTeacherNoQuey(DataTablesParameters dps)
    list_check: 'Admin/EvaluationTeacherNoQuey',
    // 获得所有已审核教师列表：EvaluationTeacherYesQuey(DataTablesParameters dps)
    list_all: 'Admin/EvaluationTeacherYesQuey',
    // 教师审核通过：EvaluationTeacherYes(int teacherid) 教师id
    yes: 'Admin/EvaluationTeacherYes',
    // 审核不通过：EvaluationTeacherNo(int teacherid) 教师id
    no: 'Admin/EvaluationTeacherNo',
    // 获取教师已批改文章 ： GetArticleCorrect(DataTablesParameters dps)
    commented_list: 'Admin/GetCorrectArticle',
    // 教师未批改作文:GetCorrectArticleNo(DataTablesParameters dps)
    not_commented_list: 'Admin/GetCorrectArticleNo'
}

// 管理员
Host.admin = {
    // 获取未审核管理员：EvaluationAdminNo(DataTablesParameters dps)
    list_wait: 'Admin/EvaluationAdminNo',
    // 管理员审核不通过:AuditAdminNo(int adminid)
    operate_refuse: 'Admin/AuditAdminNo',
    // 管理员审核通过:AuditAdminYes(int adminid)
    operate_pass: 'Admin/AuditAdminYes',

    // 获取已审核管理员：EvaluationAdminYes(DataTablesParameters dps)
    list_passed: 'Admin/EvaluationAdminYes',
    // 删除管理员：AdminDel(int adminid) 管理员Id
    operate_delete: 'Admin/AdminDel',

    // 超级管理员修改密码:UpdateUserPassword(int adminid,string oldpwd ,string newpwd) 管理员id,旧密码,新密码
    super_admin_modify_pwd: 'Admin/UpdateUserPassword',
    // 获取角色列表: GetRole(DataTablesParameters dps)
    get_role_list: 'Admin/GetRole',
    // 授予权限:AwardPermission(int roleId,int adminid)    角色id,管理员id(被授予权限子管理员的id)
    modify_permission: 'Admin/AwardPermission',
    // 获取当前管理员信息:GetAdminInfo(int adminid)     管理员id
    get_detail_info: 'Admin/GetAdminInfo'
}

// 课时管理
Host.study_hour = {
    setting: {
        // 修改课时:UpdateHour(int register,int complete,int  invitation)  注册课时,完善信息课时,邀请课时
        modify: 'Admin/UpdateHour',
        // 获取课时:GetHour()
        get: 'Admin/GetHour'
    }
}

// 设置富文本内容
Host.rich_text = {
    // 获取其他详细信息:GetRests(int type) 1:关于我们 2:友情链接  3:联系我们 4:加入我们
    get: 'Admin/GetRests',
    // UpdateRests(int type,string richtext)     类型,富文本
    modify: 'Admin/UpdateRests'
}
// 设置LOGO图片
Host.logo = {
    // 后台获取Logo：GetLogo()
    get: 'Admin/GetLogo',
    // 后台修改Logo：UpdateLogo(int logoid)
    modify: 'Admin/UpdateLogo',
    // add Logo：UpdateLogo(int logoid)
    add: 'Admin/UpdateLogo'
}

// 分享
Host.share = {
    // 获取推荐人列表：ReferrerList(DataTablesParameters dps)
    url: 'Admin/ReferrerList'
}
// 充值管理
Host.pay = {
    // 获取
    get: 'Admin/GetGathering',
    // 修改
    mod:'Admin/UpdateGathering',
    // 增加
    add:'Admin/AddGathering'

}
// 预约上课管理
Host.courseTime = {
    // 增加
    add: 'Admin/CourseTimeAdd',
    // 修改
    mod:'Admin/CourseTimeUpdate',
    // 删除
    del:'Admin/CourseTimeDel',
    // list
    list:'Admin/CourseTimeQuey',

}
// 后端设置预约上课次数：
Host.updateCountTimeCount = {
    // 增加
    set: 'Admin/UpdateCountTimeCount',
    // 修改
    get:'Admin/GetCountTimeCount',

}
// 学生操作手册
Host.studentOperation = {
    // 增加
    list: 'Admin/GetStudentCTRL',
    // 修改
    mod:'Admin/UpdateStudentCTRL',

}
// 客服中心问答
Host.qa = {

    list:"Admin/IMReplyQuey",
    // 增加
    add: 'Admin/AddIMReply',
    // 修改
    mod:'Admin/UpdateIMReply',
    //删除
    del:'Admin/DelIMReply'

}
// 设为热点
Host.hot = {

    set:"Admin/IsHostPot"

}