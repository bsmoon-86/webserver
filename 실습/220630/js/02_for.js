// 주사위 2개를 동시에 굴렸을때 합이 6이 되는 경우는?
for(var i = 1; i <=6; i++){     //for i가 1,2,3,4,5,6 총 6번 반복
    for(var j = 1; j <= 6; j++){    //for문은 6번 반복
        if(i+j == 6){       // 두 주사위의 합이 6인경우
            // console.log(i, j)
        }
    }
}
// i 1일때 6번, 2일때 6번,..... 총 36번 반복

//연산자 +,-,*,/,% 
//for문을 이용해서 두 주사위 합이 5의 배수인 경우를 출력하시오

//5의 배수를 조건식으로 만드려면 주사위 2개 5인경우와 10인 경우
//5로 나눴을때 나머지가 0인 경우 
//if(두주사위의합 % 5 == 0) , if(두주사위 합 == 5 && 두주사위의 합 == 10)

for(var i = 1; i <= 6; i++){
    for(var j=1; j <=6; j++){
        if( (i+j)%5 == 0 ){
            console.log(i, j)
        }
    }
}