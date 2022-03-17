import { appendFileSync } from 'fs';

const writeSqlForSeedData = () => {
  for (let i = 0; i < 500; i++) {
    appendFileSync('seed.sql', `insert into user (user_uid, email, password, nickname) values ('a${i}', 'noah${i}@gmail.com', '4e9380fe40420bb550f04678991a506ef5cbea532393e95e00746619f8ca1bf1ac29fb01b4fcd4f10ece787d3f65e180ab57fd226f0c972d094443a898ce65a8', 'mockUser${i}');\n`);
    for (let j = 0; j < 4; j++) {
      appendFileSync('seed.sql', `insert into post_room (post_room_uid, title, max_head_count) values ('b${i}${j}', '피자 같이 시킬사람?', 10);\n`);
      appendFileSync('seed.sql', `insert into post (title, description, location, max_head_count, postRoomPostRoomUid, userUserUid) values ('피자 같이 시킬사람?', '장소는 쪽문 또는 정문~~', 3, 10, 'b${i}${j}', 'a${i}');\n`);
      appendFileSync('seed.sql', `insert into post_room_users_user (postRoomPostRoomUid, userUserUid) values ('b${i}${j}', 'a${i}');\n`);
    }
  }
}

writeSqlForSeedData();