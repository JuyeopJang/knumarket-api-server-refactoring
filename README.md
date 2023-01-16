# knumarket-api-server-refactoring 서버 구조도
![knumarket-api-server-diagram drawio](https://user-images.githubusercontent.com/68889506/156391976-5acea461-10df-43d7-9ea3-30dcc70b755b.svg)

## 프로젝트 개요
knumarket 이란 경북대학교의 영어 약자인 knu와 market의 합성어로 경북대학교 학생들을 위한 공동구매 서비스입니다.

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
