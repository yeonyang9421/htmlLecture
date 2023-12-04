import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Block } from "../modules/PhotoSticker/models/Block";
import { SpanText } from "./customText/SpanText";
import { CategoryPackageJsonModel, LicenseJsonModel } from "../models/blocks/BlockTransportSystemJsonModel";
import i18n from '../../shared/internationalization/I18nSetting';
import { CreatorCode } from '../constants/Screen';

/**
 * BlockListClassic 컴포넌트는 클래식, 굵은프레임, 얇은프레임, 미니 제품에 적용됩니다.
 * block데이터 타입을 Block을 쓰고 있습니다.
 */

const RightContainer = styled.div`
  width: 930px;
  height: 660px;
  overflow-y: scroll;
  background-color: #FFFFFF;
  padding-bottom : 60px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 40px;
`;

const Title = styled.div`
  height: 35px;
  font-size: 24px;
  line-height: 24px;
  font-family: notosans_cjk_bold;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 6px;
  row-gap: 8px;
  padding-bottom: 60px;
  border-bottom: 3px solid #F3F3F3;
`;

const Card = styled.div`
  width: 136px;
  height: 102px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const LicenseCardHorizontal = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
`;

const LicenseCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
`;

const LicenseCard = styled.div<{
  selected: boolean;
}>`
  width: 142px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${props => props.selected ? 0.3 : 1};
`

const LicenseImage = styled.img<{
  width: number;
  height: number;
}>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: red;
  border-radius: 51px;
  object-fit: cover;
`;

const ThemeListToggle = styled.div`
  width: 130px;
  height: 46px;
  border-radius: 27px;
  border: 2px solid #A4A4A4;
  color: #A4A4A4;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 18px;

  &:active {
    border: 2px solid #FFFFFF;
    color: #FFFFFF;
    background-color: #A4A4A4;
  }
`;

const LeftContainer = styled.div`
  width: 150px;
  height: 1100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Item = styled.div<{
  selected: boolean;
}>`
  width: 100%;
  height: 80px;
  border-top: 1px solid #FFFFFF;
  background-color: ${props => props.selected ? "#DCE4FF" : "transparent"};
  overflow: hidden;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: pre-wrap;
`;

const GradientBottom = styled.div`
  position : absolute;
  bottom : 20px;
  height : 150px;
  width : 100%;
  display : flex;
  background : linear-gradient(#fff0, #ffff);
  text-align : center;
  justify-content: center;
  align-items: center;
`;

const BottomContent = styled.div`
  position : absolute;
  bottom : 15px;
  height : 44px;
  width : 100%;
  color : #666666;
`;

const LicenseName = styled.div`
margin-right: 8px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
font-size : 24px;
color : #4A4A4A;
width : 140px;
text-align : center;
font-weight : bolder;
`;

interface Props {
  contentsWithPackage: { [key: string]: Block[] };
  contentsWithLicense: { [key: string]: Block[] };
  packageNames: CategoryPackageJsonModel[];
  licenseNames: LicenseJsonModel[];
  scrollTop: number;
  hostUrl: string;
  changeTabMenu?: (id: string) => void;
  onClickItem: (block: Block) => void;
  handleScroll: (scrollTop: number) => void;
}

const BlockListClassic = ({
  packageNames,
  licenseNames,
  contentsWithPackage,
  contentsWithLicense,
  hostUrl,
  scrollTop,
  handleScroll,
  onClickItem,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const titleElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentLicense, setCurrentLicense] = useState<LicenseJsonModel | null>(licenseNames[0] ?? null);
  const [currentPackageId, setCurrentPackageId] = useState(packageNames[0].id??"");
  const [isShowBottomContent, setIsShowBottomContent] = useState(false);

  const onScroll = () => {
    handleScroll(scrollRef.current?.scrollTop ?? 0);
    const target = scrollRef.current;
    if(target.scrollHeight - target.scrollTop === target.clientHeight){
      setIsShowBottomContent(false);
    }else{
      setIsShowBottomContent(true);
    }
  };

  const handleListToggle = () => {
    setCurrentLicense(null);
  };

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  useEffect(() => {
    if (packageNames) {
     setCurrentPackageId(packageNames[0].id);
    }
  }, [packageNames]);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      let topElement: IntersectionObserverEntry | null = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          topElement = entry;
        }
      });

      if (topElement !== null) {
        const id = topElement.target.getAttribute('id');
        if (id !== null) {
          setCurrentPackageId(id);
        }
      }
    }, { root: null, rootMargin: "0px", threshold: 0.5 });

    const { current: currentObserver } = observer;
    titleElementsRef.current.forEach(element => element && currentObserver.observe(element));
    return () => {
     titleElementsRef.current.forEach(element => element && currentObserver.unobserve(element));
    };
  }, []);

  const onClickTab = (id: string) => {
    const packageTabIndex = packageNames.findIndex((el) => el.id === id) ?? 0;
    if (titleElementsRef.current) {
      titleElementsRef.current[packageTabIndex]?.scrollIntoView({behavior: "smooth", block: "start",});
    }
    setCurrentPackageId(id)
  };

  return (
    <div className="flex_row justify_start">
    {contentsWithPackage && packageNames && (<>
      {isShowBottomContent && 
      <GradientBottom>
        <BottomContent>
          <span style={{fontSize:"40px"}}>⩔</span>
          <span style={{fontSize:"30px", paddingLeft:"10px", paddingRight:"10px"}}> {i18n.t("scroll-down-more-designs")} </span>
          <span style={{fontSize:"40px"}}>⩔</span> 
        </BottomContent>
      </GradientBottom>}
    <LeftContainer>
      {packageNames.map((packageName) => (
         contentsWithPackage[packageName.id] && contentsWithPackage[packageName.id].length !== 0 && 
        <Item 
          key={packageName.id} 
          selected={packageName.id === currentPackageId}
          onClick={() => {
            onClickTab(packageName.id)
          }}
        >{packageName.name}
        </Item>
      ))}
    </LeftContainer>
    <RightContainer ref={scrollRef} onScroll={onScroll}>
      {packageNames.map((packageName: CategoryPackageJsonModel, index) => (
        contentsWithPackage[packageName.id] && contentsWithPackage[packageName.id].length !== 0 && 
        <CategoryContainer key={packageName.id} ref={el => titleElementsRef.current[index] = el} id={packageName.id}>
          <Title>{packageName.name}</Title>
          <CardContainer>
          {/* package가 작가디자인인지 여부에 따라 분기를 나눔 */}
          {contentsWithPackage[packageName.id] && packageName.id !== CreatorCode.CREATOR && contentsWithPackage[packageName.id].map((item: Block) => (
            <Card 
              key={item.id} 
              onClick={() => onClickItem(item)}
            >
              <Image src={hostUrl + item.iconUrl} alt={item.name} />
            </Card>
          ))}
          {contentsWithPackage[packageName.id] && packageName.id === CreatorCode.CREATOR && (
            <div>
              {currentLicense && Object.entries(contentsWithLicense)
              ?.filter(([licenseId]) => licenseNames.find((license) => license.id === licenseId) === currentLicense)
              .map(([licenseId, contents]) => (
                <div key={licenseId}>
                  <LicenseCardHorizontal>
                    <LicenseImage src={hostUrl + currentLicense.thumbnailUrl} width={60} height={60} style={{ marginRight: "13px" }}/>
                    <SpanText 
                      fontSize={24} 
                      color={"#4A4A4A"} 
                      fontFamily={"NotoSansCjkBold"}
                      style={{ marginRight: "8px", whiteSpace: "nowrap" }}
                    >{currentLicense.name}</SpanText>
                    <SpanText 
                      fontSize={19} 
                      color={"#4A4A4A"} 
                      fontFamily={"NotoSansCjkRegular"}
                      style={{ whiteSpace: "nowrap", paddingRight:"10px" }}
                    >{i18n.t("themes")} </SpanText>
                    <SpanText fontSize={19} color={"#88A2FF"} fontFamily={"NotoSansCjkRegular"}>{contents.length}</SpanText>
                    <ThemeListToggle onClick={handleListToggle}>{i18n.t("collapse-list")}</ThemeListToggle>
                  </LicenseCardHorizontal>
                  <CardContainer style={{ border: "none" }}>
                    {contents.map((block: Block) => (
                      <Card 
                        key={block.id}
                        onClick={() => onClickItem(block)}
                      >
                        <Image src={hostUrl + block.iconUrl} alt={""} />
                      </Card>
                    ))}
                  </CardContainer>
                </div>
              ))}
              <LicenseCardContainer>
                {Object.entries(contentsWithLicense)
                  ?.filter(([licenseId]) => licenseNames.find((license) => license.id === licenseId) !== undefined)
                  .map(([licenseId, contents]) => (
                    <LicenseCard 
                      key={licenseId} 
                      onClick={() => setCurrentLicense(licenseNames.find((license) => license.id === licenseId))}
                      selected={licenseId === currentLicense?.id}
                    >
                      <LicenseImage src={hostUrl + licenseNames.find((license) => license.id === licenseId).thumbnailUrl} width={80} height={80} style={{ marginTop: "20px" }}/>
                      <LicenseName>{licenseNames.find((license) => license.id === licenseId).name}</LicenseName>
                      <div>
                        <SpanText fontSize={16} color={"#4A4A4A"} fontFamily={"NotoSansCjkRegular"}>{i18n.t("themes")}  </SpanText>
                        <SpanText fontSize={16} color={"#88A2FF"} fontFamily={"NotoSansCjkRegular"}>{contents.length}</SpanText>
                      </div>
                    </LicenseCard>
                  ))
                }
              </LicenseCardContainer>
            </div>
          )}
          </CardContainer>
        </CategoryContainer>
      ))}
    </RightContainer>
    </>)}
    </div>
  )
}

export default BlockListClassic;