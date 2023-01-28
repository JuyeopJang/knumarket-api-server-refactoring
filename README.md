# 크누마켓

## 프로젝트 개요
knumarket 이란 경북대학교의 영어 약자인 knu와 market의 합성어로 경북대학교 재학생들 특히 학교 인근에 거주하는 자취생이나 기숙사생들을 위해 기획했던 공동구매 프로젝트입니다.

## 리팩토링 전 담당 역할
- 유저와 글 관련 모델의 CRUD 기능을 구현
  - 유저 회원가입, 로그인, 로그아웃, 비밀번호 찾기 기능 등을 구현
  - 공동구매 글 조회, 상세 조회, 생성, 수정, 삭제 기능 등을 구현
- 인증과 같은 공통 로직을 미들웨어로 분리해 코드 중복을 제거

## 사용 기술
Typescript, Koa.js, MariaDB, TypeORM

## 리팩토링 배경
개발 당시에는 기능을 만드는 데에만 급급했고 문득 서비스의 규모가 커지고 트래픽이 늘어나도 문제가 없을까라는 의문이 들었습니다. 그렇게 중, 대규모 애플리케이션의 경우 문제가 될 수 있는 몇몇 상황을 임의로 만들어 보고 문제를 해결해 보면 좋은 공부가 될 거 같다는 생각에 방학기간을 이용해 프로젝트 리팩토링을 진행했습니다.
  
# knumarket-api-server-refactoring 서버 구조도
![knumarket-api-server-diagram drawio](https://user-images.githubusercontent.com/68889506/156391976-5acea461-10df-43d7-9ea3-30dcc70b755b.svg)

## 프로젝트 리팩토링 목표
- 특정 SQL 조회 쿼리를 인덱싱해 성능을 개선해 본다.
- 단일 서버의 성능 분석을 토대로 API 서버의 스케일 아웃을 적용해 본다.
- Github Actions와 AWS Elastic Beanstalk을 활용하여 CI/CD 파이프라인을 구축한다.
- Layerd Architecture를 적용하여 각 계층을 분리하고 확장과 유지 보수 및 테스트에 용이한 시스템을 설계한다.

## 프로젝트 리팩토링 과정의 기록
### 1. Architecture
- [Layerd Architecture & DI & Unit Test](https://velog.io/@zooyeop/Architecture-Layerd-Architecture-DI-Unit-Test)
### 2. Database
- [Paging Query With Index](https://velog.io/@zooyeop/Database-Paging-query-with-index-1)
### 3. CI/CD
- [Github Actions & AWS Elastic Beanstalk (1)](https://velog.io/@zooyeop/Github-Actions-CICD-1)
- [Github Actions & AWS Elastic Beanstalk (2)](https://velog.io/@zooyeop/CICD-Github-Actions-AWS-Elastic-Beanstalk-2)

## DB ERD
![Knumarket](https://user-images.githubusercontent.com/68889506/156399920-1f87f609-5042-451b-8f01-e1f0f9ae8ad6.png)
