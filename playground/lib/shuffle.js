class StextShuffle {
  constructor(scenario) {
    this.scenario = JSON.parse(JSON.stringify(scenario));
    this.fixed = {};
  }

  // メイン処理
  run() {
      this.randomSort();
      this.generateNewId();
      this.generateNewFromTo();
      this.searchFixedScene();
      this.rewriteIdForFixedScene();
      this.rewriteEdgeId();
      this.deleteOldId();
  }

  // scene要素をシャッフル
  randomSort() {
      this.scenario.scenes.sort(function(m, n) {
          return Math.random() - 0.5;
      });
  }

  // 現在の並び順に従ってid値を生成
  generateNewId() {
    this.scenario.scenes.forEach(function(s, index) {
        s.old_id = s.id;
        s.id = String(index);
    });
  }

  // EdgeのFrom/Toをold_xxxxxに移動
  generateNewFromTo() {
    this.scenario.edges.forEach(function(e) {
        e.old_from = e.from;
        e.old_to = e.to;
    }); 
  }

  // 固定されたシーンを取得（「旧id: 新id」形式）
  searchFixedScene() {
    let that = this;
    this.fixed = {};
    this.scenario.scenes.forEach(function(s) {
        if (s.fixed || s.old_id === '0') {
            that.fixed[s.old_id] = s.id;
        } 
    });
  }

  // 指定のidに等しいシーンを取得
  searchSceneById(id) {
      return this.scenario.scenes.find(function(s) {
        return s.id === id;
      });
  }

  searchSceneByOldId(old_id) {
    return this.scenario.scenes.find(function(s) {
      return s.old_id === old_id;
    });
  }

  // 固定idを退避
  rewriteIdForFixedScene() {
      let that = this;
      let fixed_keys = Object.keys(this.fixed);
      this.scenario.scenes.forEach(function(s, index) {      
        if (fixed_keys.includes(s.old_id)) {
            console.log(`${s.id} / ${s.old_id}: ${s.text}`);
            console.log(that.searchSceneById(s.old_id));
            
            // 固定id（old_id）を現在持っているシーンを取得
            let to_scene = that.searchSceneById(s.old_id);
            if (to_scene) {
              // 存在する場合はスワップ
              to_scene.id = s.id;
              s.id = s.old_id;
            } else {
              // 空の場合は、現在のシーンidを修正
              s.id = s.old_id;
            }
        }
      });
  }

  // EdgeのFrom/Toを書き換え
  rewriteEdgeId() {
    let that = this;
    this.scenario.edges.forEach(function(e) {
        e.from = that.searchSceneByOldId(e.old_from).id;
        e.to = that.searchSceneByOldId(e.old_to).id;
        delete e.old_from;
        delete e.old_to;
    });
  }

  deleteOldId() {
    this.scenario.scenes.forEach(function(s) {
        // ラベルも更新
        s.label = `${s.id}\n${s.summary}`;
        delete s.old_id;
    });
  }
}