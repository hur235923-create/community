import { describe, it, expect } from "vitest"
import { serializeUser, deserializeUser } from "../session"
import type { SessionUser } from "../session"

describe("session serialize", () => {
  it("직렬화 후 역직렬화하면 동일 유저", () => {
    const u: SessionUser = { id: 1, username: "test", nickname: "테스터" }
    expect(deserializeUser(serializeUser(u))).toEqual(u)
  })

  it("잘못된 문자열/누락 필드는 null", () => {
    expect(deserializeUser("not-json")).toBeNull()
    expect(deserializeUser(null)).toBeNull()
    expect(deserializeUser(JSON.stringify({ id: 1 }))).toBeNull()
  })
})
