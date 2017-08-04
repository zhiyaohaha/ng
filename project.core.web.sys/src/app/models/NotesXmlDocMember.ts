import { NotesXmlDocMemberSummary } from "./NotesXmlDocMemberSummary";
import { NotesXmlDocMemberParam } from "./NotesXmlDocMemberParam";

/**
  * XML注释文档=>成员
  * author sunpengfei
  */
export class NotesXmlDocMember {

    /**
      * 名称
      */
    Name : string;

    /**
      * 总结
      */
    Summary : NotesXmlDocMemberSummary;

    /**
      * 参数集合
      */
    Params : NotesXmlDocMemberParam[];

    /**
      * 返回内容
      */
    Return : string;

    /**
      * 备注
      */
    Remark : string;

    /**
      * 例子
      */
    Example : string;

}
