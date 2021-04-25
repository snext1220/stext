class RpgCube {
    // target：ダイスの反映先
    // type：ダイス型（数値：1～n、文字列：dicesetのキー）
    // num：ダイスの個数（2～5）
    constructor(target, type = 6 , num = 2) {
        this.diceset = {
            'high' : [4, 5, 6],
            'cheat_l': [1, 1, 1, 2, 3, 4, 5, 6],
            'cheat_h': [1, 2, 3, 4, 5, 6, 6, 6],
        };
        this.type = type;
        this.target = target;
        this.num = num;
        this.current = [1, 1];
        this.rotateCount = 1;
    }

    // ダイスのためのHTMLを生成（private）
    getHtml() {
        let html = '';
        for (let i = 0; i < this.num; i++) {
          // ダイスの値を保管
          if (Array.isArray(this.type)) {
              // TODO
          } else {
            this.current[i] = Util.random(1, this.type);
          }
          html += `<img src="${ROOT}${COMMON}cube${this.current[i]}.png" class="dice" />`;
        }
        return html;
    }

    // 1回分のローテート（private）
    rotateOne() {
        this.rotateCount++;
        $(target).html(this.getHtml());
        if(rotate_count > 20) { return; }
        setTimeout(this.rotateOne, 50);
    }

    // ダイスを振る
    rotate() {
        SeAudio.play('dice', true);
        rotate_count = 1;
        this.rotateOne();
    }

    // 出目を取得（）
    getRoll(key) {
        switch(this.num) {
            case 2:
               if (key === 'L') { return this.current[0]; }
               if (key === 'R') { return this.current[1]; }
               break;
            case 3:
                if (key === 'L') { return this.current[0]; }
                if (key === 'M') { return this.current[1]; }
                if (key === 'R') { return this.current[2]; }
                break;
            case 4:
                if (key === 'L')  { return this.current[0]; }
                if (key === 'LM') { return this.current[1]; }
                if (key === 'RM') { return this.current[2]; }
                if (key === 'R')  { return this.current[3]; }
                break;
            case 5:
                if (key === 'L')  { return this.current[0]; }
                if (key === 'LM') { return this.current[1]; }
                if (key === 'M')  { return this.current[2]; }
                if (key === 'LR') { return this.current[3]; }
                if (key === 'R')  { return this.current[4]; }
                break;
        }
        return 0;
    }
}
