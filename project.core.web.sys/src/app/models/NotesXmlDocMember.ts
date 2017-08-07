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
  name : string;

  /**
    * 总结
    */
  summary : NotesXmlDocMemberSummary;

  /**
    * 参数集合
    */
  paramsList : NotesXmlDocMemberParam[];

  /**
    * 返回内容
    */
  returnContent : string;

  /**
    * 备注
    */
  remark : string;

  /**
    * 例子
    */
  example : string;

}
