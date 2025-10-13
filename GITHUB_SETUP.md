# 🐙 GitHub 저장소 생성 가이드

## 방법 1: 웹 브라우저에서 생성 (가장 쉬움)

### 1단계: GitHub 웹사이트에서 저장소 생성

1. https://github.com 접속 및 로그인
2. 우측 상단 `+` 버튼 클릭 → `New repository` 선택
3. 저장소 정보 입력:
   - **Repository name**: `youth-life`
   - **Description**: `오행 리듬 기반 인생 운영 시스템 - 게임처럼 즐기는 생산성 앱`
   - **Public** 또는 **Private** 선택
   - ⚠️ **중요**: "Initialize this repository with:" 항목은 모두 체크 해제!
     - [ ] Add a README file (체크 해제)
     - [ ] Add .gitignore (체크 해제)
     - [ ] Choose a license (체크 해제)
4. `Create repository` 버튼 클릭

### 2단계: 로컬 저장소와 연결

GitHub에서 저장소 생성 후 나오는 페이지에서 다음 명령어를 복사하여 실행:

```bash
# 현재 Youth_Life 디렉토리에서 실행
git remote add origin https://github.com/YOUR_USERNAME/youth-life.git
git branch -M master
git push -u origin master
```

**YOUR_USERNAME**을 실제 GitHub 사용자명으로 변경하세요!

예시:
```bash
git remote add origin https://github.com/jys13/youth-life.git
git branch -M master
git push -u origin master
```

### 3단계: 인증

푸시할 때 인증 요청이 나오면:

#### Option A: Personal Access Token (권장)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. `Generate new token (classic)` 클릭
3. Note: `youth-life-deployment`
4. Expiration: `90 days`
5. Select scopes:
   - [x] repo (전체 체크)
6. `Generate token` 클릭
7. **토큰 복사** (다시 볼 수 없음!)
8. Git push 시 비밀번호 대신 토큰 입력

#### Option B: GitHub Desktop 사용
1. [GitHub Desktop](https://desktop.github.com/) 다운로드
2. 설치 후 GitHub 계정으로 로그인
3. `File` → `Add Local Repository`
4. `C:\Users\jys13\Youth_Life` 선택
5. `Publish repository` 버튼 클릭

---

## 방법 2: GitHub CLI 설치 후 사용 (빠름)

### 1단계: GitHub CLI 설치

**Windows (PowerShell 관리자 권한 필요)**:
```powershell
winget install --id GitHub.cli
```

또는 [다운로드](https://cli.github.com/)

### 2단계: 로그인 및 저장소 생성

```bash
# GitHub 로그인
gh auth login

# 저장소 생성 및 푸시 (한 번에!)
gh repo create youth-life --public --source=. --remote=origin --push
```

---

## 방법 3: SSH 키 사용 (고급)

### 1단계: SSH 키 생성 (없는 경우)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Enter 3번 (기본 위치, 비밀번호 없음)
```

### 2단계: SSH 키를 GitHub에 추가

```bash
# 공개키 복사
cat ~/.ssh/id_ed25519.pub
```

1. GitHub → Settings → SSH and GPG keys
2. `New SSH key` 클릭
3. Title: `Youth Life Development`
4. Key: 복사한 공개키 붙여넣기
5. `Add SSH key` 클릭

### 3단계: SSH로 푸시

```bash
git remote add origin git@github.com:YOUR_USERNAME/youth-life.git
git push -u origin master
```

---

## 푸시 확인

성공적으로 푸시되면 다음과 같은 메시지가 나옵니다:

```
Enumerating objects: 34, done.
Counting objects: 100% (34/34), done.
Delta compression using up to 8 threads
Compressing objects: 100% (30/30), done.
Writing objects: 100% (34/34), 25.45 KiB | 3.18 MiB/s, done.
Total 34 (delta 2), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/youth-life.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

---

## 문제 해결

### "remote origin already exists" 에러

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/youth-life.git
```

### "failed to push some refs" 에러

```bash
# 강제 푸시 (주의: 원격 저장소가 비어있을 때만!)
git push -u origin master --force
```

### 인증 실패

1. Personal Access Token 재발급
2. Windows 자격 증명 관리자에서 GitHub 자격 증명 삭제:
   - 제어판 → 자격 증명 관리자 → Windows 자격 증명 → github.com 삭제
3. 다시 push 시도

---

## 푸시 후 확인사항

✅ GitHub 저장소 페이지에서 확인:
- [ ] 모든 파일이 업로드되었는지
- [ ] README.md가 제대로 표시되는지
- [ ] 5개의 커밋이 모두 있는지

다음 단계: **Vercel 배포**로 이동!
