import React from 'react';
import { Link } from 'react-router-dom';
import Slideshow from './Slideshow';
import ProgressBar from './ProgressBar';
import VerifiedBadge from './VerifiedBadge';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post }) {
  const { toggleSavePost, isPostSaved } = useAuth();
  if (!post) return null;

  const {
    id,
    title,
    summary,
    impact_count,
    funds_goal,
    funds_raised,
    volunteers_needed,
    media_urls,
    is_top_needed,
    ngo = {},
  } = post;

  const isSaved = isPostSaved(id);
  const hasDonation = funds_goal > 0 && ngo?.donation_url;
  const hasVolunteer = volunteers_needed > 0 && ngo?.google_form_url;

  return (
    <article className="post-card">
      {/* Media Slideshow with Multi-Badges */}
      <div style={{ position: 'relative' }}>
        <Slideshow
          media_urls={media_urls}
          title={title}
          placeholderEmoji={ngo.logo_emoji || '🎗️'}
        />

        {Number(is_top_needed) === 1 && (
          <div className="badge-top-needed">
            <span>🔥</span>
            <span>MOST NEEDED</span>
          </div>
        )}

        {/* 80G Tax Benefit Badge */}
        <div
          className="badge-80g"
          style={{ left: Number(is_top_needed) === 1 ? '8.8rem' : '0.75rem' }}
          title="Eligible for 50% deduction under Section 80G of the Income Tax Act"
        >
          <span>🏛️</span>
          <span>80G TAX BENEFIT</span>
        </div>

        {/* Save for Seva Bookmark Button */}
        <button
          type="button"
          className="badge-save-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSavePost(id);
          }}
          title={isSaved ? 'Remove from Saved Seva' : 'Save for Seva'}
          aria-label={isSaved ? 'Remove from Saved' : 'Save for Seva'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Card Content Body */}
      <div className="post-card-body">
        {/* NGO Row */}
        <Link to={`/ngo/${ngo.id || 1}`} className="post-ngo-row">
          <span>{ngo.logo_emoji || '🏢'}</span>
          <span>{ngo.name || 'Verified NGO'}</span>
          <VerifiedBadge status={ngo.status} showText={false} />
        </Link>

        {/* Post Title */}
        <h3 className="post-card-title">
          <Link to={`/post/${id}`} style={{ color: 'inherit' }}>
            {title}
          </Link>
        </h3>

        {/* Summary (Max 2 lines) */}
        <p className="post-card-summary">{summary}</p>

        {/* Impact Stat */}
        <div className="post-impact-stat">
          <span>📊</span>
          <span>{Number(impact_count || 0).toLocaleString('en-IN')} people helped so far</span>
        </div>

        {/* Progress Bar (Only if funds_goal > 0) */}
        {funds_goal > 0 && (
          <ProgressBar funds_raised={funds_raised} funds_goal={funds_goal} />
        )}

        {/* Action Buttons */}
        <div className="post-card-actions">
          <div
            className={`post-action-buttons-row ${
              hasDonation && hasVolunteer ? '' : 'single-col'
            }`}
          >
            {hasDonation && (
              <a
                href={ngo.donation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 0.6rem' }}
              >
                <span>💰</span>
                <span>Book My Seva</span>
              </a>
            )}

            {hasVolunteer && (
              <a
                href={ngo.google_form_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 0.6rem' }}
              >
                <span>👥</span>
                <span>Register for Seva</span>
              </a>
            )}
          </div>

          <Link
            to={`/post/${id}`}
            className="btn-outline"
            style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem' }}
          >
            View Full Impact Drive →
          </Link>
        </div>
      </div>
    </article>
  );
}
